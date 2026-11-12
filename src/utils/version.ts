/** Parse "v1.2.3", "1.2.3-beta.1" etc. into comparable numeric parts. */
export function parseVersion(input: string): number[] | null {
  const m = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(input.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

/** Returns 1 if a > b, -1 if a < b, 0 if equal or either is unparseable. */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

export function isNewer(candidate: string, current: string): boolean {
  return compareVersions(candidate, current) === 1;
}
