import { isNewer } from '../utils/version';

export interface UpdateSource {
  owner: string;
  repo: string;
}

export interface UpdateInfo {
  version: string;
  notes: string;
  publishedAt: string;
  pageUrl: string;
  apkUrl: string;
  apkName: string;
  sizeBytes: number;
  /** Lower-case hex SHA-256 of the APK, when the release publishes one. */
  sha256: string | null;
}

interface GithubAsset {
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string | null;
}

interface GithubRelease {
  tag_name: string;
  body?: string | null;
  html_url: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GithubAsset[];
}

export type CheckResult =
  | { status: 'up-to-date' }
  | { status: 'available'; update: UpdateInfo }
  | { status: 'unavailable'; reason: 'offline' | 'rate-limited' | 'no-release' | 'no-apk' | 'server-error' };

const HEX64 = /^[0-9a-f]{64}$/;

const KNOWN_ABIS = ['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86'];

/**
 * Releases ship one APK per processor type (e.g. app-1.2.0-arm64-v8a.apk). Pick the one this phone
 * runs best: the first of its supported ABIs that has an APK, else an APK built for all of them.
 */
export function pickApk(assets: GithubAsset[], abis: string[]): GithubAsset | undefined {
  const apks = assets.filter((a) => a.name.toLowerCase().endsWith('.apk'));
  for (const abi of abis) {
    const match = apks.find((a) => a.name.toLowerCase().includes(`-${abi.toLowerCase()}.apk`));
    if (match) return match;
  }
  return apks.find((a) => !KNOWN_ABIS.some((abi) => a.name.toLowerCase().includes(`-${abi}.apk`))) ?? (abis.length === 0 ? apks[0] : undefined);
}

/** Pure: turn a GitHub release payload into an update decision. Exported for tests. */
export function evaluateRelease(release: GithubRelease, currentVersion: string, sha256FromSidecar?: string | null, abis: string[] = []): CheckResult {
  if (release.draft || release.prerelease) return { status: 'up-to-date' };
  if (!isNewer(release.tag_name, currentVersion)) return { status: 'up-to-date' };
  const apk = pickApk(release.assets, abis);
  if (!apk) return { status: 'unavailable', reason: 'no-apk' };
  const fromApi = apk.digest?.toLowerCase().replace(/^sha256:/, '') ?? null;
  const candidate = fromApi ?? sha256FromSidecar?.trim().split(/\s+/)[0]?.toLowerCase() ?? null;
  return {
    status: 'available',
    update: {
      version: release.tag_name.replace(/^v/, ''),
      notes: (release.body ?? '').trim(),
      publishedAt: release.published_at,
      pageUrl: release.html_url,
      apkUrl: apk.browser_download_url,
      apkName: apk.name,
      sizeBytes: apk.size,
      sha256: candidate && HEX64.test(candidate) ? candidate : null,
    },
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Ask GitHub whether a newer release exists. Never throws: network problems become `unavailable`. */
export async function checkForUpdate(source: UpdateSource, currentVersion: string, abis: string[] = []): Promise<CheckResult> {
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/releases/latest`;
  let response: Response;
  try {
    response = await fetchWithTimeout(url, { headers: { Accept: 'application/vnd.github+json' } }, 10_000);
  } catch {
    return { status: 'unavailable', reason: 'offline' };
  }
  if (response.status === 404) return { status: 'unavailable', reason: 'no-release' };
  if (response.status === 403 || response.status === 429) return { status: 'unavailable', reason: 'rate-limited' };
  if (!response.ok) return { status: 'unavailable', reason: 'server-error' };

  let release: GithubRelease;
  try {
    release = (await response.json()) as GithubRelease;
  } catch {
    return { status: 'unavailable', reason: 'server-error' };
  }
  if (!release || typeof release.tag_name !== 'string' || !Array.isArray(release.assets)) {
    return { status: 'unavailable', reason: 'server-error' };
  }

  let sidecar: string | null = null;
  const apk = pickApk(release.assets, abis);
  if (apk && !apk.digest) {
    const sums = release.assets.find((a) => a.name === `${apk.name}.sha256`);
    if (sums) {
      try {
        const r = await fetchWithTimeout(sums.browser_download_url, {}, 10_000);
        if (r.ok) sidecar = await r.text();
      } catch {
        // No checksum available; the APK signature check on install still applies.
      }
    }
  }
  return evaluateRelease(release, currentVersion, sidecar, abis);
}
