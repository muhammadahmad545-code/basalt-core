/** An error whose message is safe and useful to show to the user as-is. */
export class UserFacingError extends Error {
  readonly code: string;
  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'UserFacingError';
    this.code = code;
  }
}

/**
 * Native module errors arrive wrapped, e.g.
 * "Call to function 'X.start' has been rejected.\n→ Caused by: expo.modules.x.RelayFailure: No free port".
 * Keep only the part meant for people.
 */
export function cleanNativeMessage(message: string): string {
  let text = message;
  const caused = text.split(/→\s*Caused by:\s*/);
  if (caused.length > 1) text = caused[caused.length - 1];
  text = text.replace(/^Call to function '[^']*' has been rejected\.?\s*/i, '');
  // Strip leading Java/Kotlin class names: "java.io.IOException: ..." or "RelayFailure: ...".
  text = text.replace(/^(?:[a-z_$][\w$]*\.)*[A-Z][\w$]*(?:Exception|Failure|Error):\s*/, '');
  return text.trim();
}

export function toMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof UserFacingError) return error.message;
  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  const cleaned = raw ? cleanNativeMessage(raw) : '';
  return cleaned || fallback;
}
