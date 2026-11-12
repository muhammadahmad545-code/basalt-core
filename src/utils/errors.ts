/** An error whose message is safe and useful to show to the user as-is. */
export class UserFacingError extends Error {
  readonly code: string;
  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'UserFacingError';
    this.code = code;
  }
}

export function toMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof UserFacingError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return fallback;
}
