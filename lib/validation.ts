export class ValidationError extends Error {
    status = 400;
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
export function sanitizeString(value: unknown, maxLength = 500): string {
    if (typeof value !== 'string') throw new ValidationError('Expected a string');
    return value.trim().slice(0, maxLength).replace(/\0/g, '');
}
export function validateEmail(value: unknown): string {
    const email = sanitizeString(value, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('Invalid email');
    return email.toLowerCase();
}

export function validatePassword(value: unknown): string {
  if (typeof value !== 'string') throw new ValidationError('Password must be a string');
  if (value.length < 8)  throw new ValidationError('Password must be at least 8 characters');
  if (value.length > 72) throw new ValidationError('Password too long');
  return value;
}