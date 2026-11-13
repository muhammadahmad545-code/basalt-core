import assert from 'node:assert/strict';
import { test } from 'node:test';
import { UserFacingError, cleanNativeMessage, toMessage } from './errors';

test('native wrappers and class names are stripped', () => {
  assert.equal(
    cleanNativeMessage("Call to function 'RelayTransfer.start' has been rejected.\n→ Caused by: expo.modules.relaytransfer.RelayFailure: Could not start receiving: no free port"),
    'Could not start receiving: no free port',
  );
  assert.equal(cleanNativeMessage('java.io.IOException: Broken pipe'), 'Broken pipe');
  assert.equal(cleanNativeMessage('Plain message'), 'Plain message');
});

test('toMessage prefers user-facing errors and falls back when empty', () => {
  assert.equal(toMessage(new UserFacingError('x', 'Readable')), 'Readable');
  assert.equal(toMessage(new Error('')), 'Something went wrong. Please try again.');
  assert.equal(toMessage(null, 'Fallback'), 'Fallback');
});
