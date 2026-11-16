import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateRelease, pickApk } from './github';

const base = {
  tag_name: 'v1.2.0',
  body: 'Notes',
  html_url: 'https://example.test/r',
  published_at: '2026-01-01T00:00:00Z',
  draft: false,
  prerelease: false,
  assets: [{ name: 'app-1.2.0.apk', size: 10, browser_download_url: 'https://example.test/a.apk', digest: 'sha256:' + 'AB'.repeat(32) }],
};

test('newer release with an APK is offered, digest normalised', () => {
  const r = evaluateRelease(base, '1.1.9');
  assert.equal(r.status, 'available');
  if (r.status === 'available') {
    assert.equal(r.update.version, '1.2.0');
    assert.equal(r.update.sha256, 'ab'.repeat(32));
  }
});

test('same or older release is up to date', () => {
  assert.equal(evaluateRelease(base, '1.2.0').status, 'up-to-date');
  assert.equal(evaluateRelease(base, '2.0.0').status, 'up-to-date');
});

test('prereleases and drafts are ignored', () => {
  assert.equal(evaluateRelease({ ...base, prerelease: true }, '1.0.0').status, 'up-to-date');
  assert.equal(evaluateRelease({ ...base, draft: true }, '1.0.0').status, 'up-to-date');
});

test('release without an APK is reported, not offered', () => {
  const r = evaluateRelease({ ...base, assets: [] }, '1.0.0');
  assert.deepEqual(r, { status: 'unavailable', reason: 'no-apk' });
});

test('sidecar checksum is used when the API has no digest; junk is rejected', () => {
  const noDigest = { ...base, assets: [{ ...base.assets[0], digest: null }] };
  const good = evaluateRelease(noDigest, '1.0.0', 'cd'.repeat(32) + '  app-1.2.0.apk\n');
  assert.equal(good.status === 'available' && good.update.sha256, 'cd'.repeat(32));
  const bad = evaluateRelease(noDigest, '1.0.0', '<html>not a hash</html>');
  assert.equal(bad.status === 'available' && bad.update.sha256, null);
});

test('picks the APK built for this phone, in its order of preference', () => {
  const asset = (name: string) => ({ name, size: 1, browser_download_url: `https://example.test/${name}`, digest: null });
  const assets = [asset('app-1.2.0-armeabi-v7a.apk'), asset('app-1.2.0-arm64-v8a.apk'), asset('app-1.2.0-x86_64.apk'), asset('app-1.2.0-arm64-v8a.apk.sha256')];
  assert.equal(pickApk(assets, ['arm64-v8a', 'armeabi-v7a'])?.name, 'app-1.2.0-arm64-v8a.apk');
  assert.equal(pickApk(assets, ['armeabi-v7a'])?.name, 'app-1.2.0-armeabi-v7a.apk');
  assert.equal(pickApk(assets, ['x86_64', 'arm64-v8a'])?.name, 'app-1.2.0-x86_64.apk');
  // A universal APK is the fallback; with neither, there is nothing safe to install.
  assert.equal(pickApk([asset('app-1.2.0.apk')], ['arm64-v8a'])?.name, 'app-1.2.0.apk');
  assert.equal(pickApk([asset('app-1.2.0-x86_64.apk')], ['arm64-v8a']), undefined);
  // Unknown device: first APK, as before.
  assert.equal(pickApk(assets, [])?.name, 'app-1.2.0-armeabi-v7a.apk');
});
