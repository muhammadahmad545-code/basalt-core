import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareVersions, isNewer, parseVersion } from './version';

test('parseVersion handles prefixes and partial versions', () => {
  assert.deepEqual(parseVersion('v1.2.3'), [1, 2, 3]);
  assert.deepEqual(parseVersion('2.0'), [2, 0, 0]);
  assert.deepEqual(parseVersion('1.4.0-beta.2'), [1, 4, 0]);
  assert.equal(parseVersion('nightly'), null);
});

test('compareVersions orders numerically, not lexically', () => {
  assert.equal(compareVersions('1.10.0', '1.9.9'), 1);
  assert.equal(compareVersions('v1.0.0', '1.0.0'), 0);
  assert.equal(compareVersions('0.9.0', '1.0.0'), -1);
});

test('isNewer is false for unparseable tags', () => {
  assert.equal(isNewer('latest', '1.0.0'), false);
  assert.equal(isNewer('1.0.1', '1.0.0'), true);
});
