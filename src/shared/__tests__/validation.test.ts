import { describe, it, expect } from 'vitest';
import {
  validateRequired,
  validateString,
  validateNumber,
  validateEmail,
  validateLength,
  validateEnum,
} from '@/shared/validation/Validator';
import { ValidationError } from '@/shared/errors/AppError';

describe('validateRequired', () => {
  it('returns value when present', () => {
    expect(validateRequired('hello', 'field')).toBe('hello');
    expect(validateRequired(42, 'field')).toBe(42);
  });

  it('throws for undefined', () => {
    expect(() => validateRequired(undefined, 'field')).toThrow(ValidationError);
  });

  it('throws for null', () => {
    expect(() => validateRequired(null, 'field')).toThrow(ValidationError);
  });

  it('throws for empty string', () => {
    expect(() => validateRequired('', 'field')).toThrow(ValidationError);
  });
});

describe('validateString', () => {
  it('returns string value', () => {
    expect(validateString('hello', 'field')).toBe('hello');
  });

  it('throws for non-string', () => {
    expect(() => validateString(123, 'field')).toThrow(ValidationError);
  });
});

describe('validateNumber', () => {
  it('returns number value', () => {
    expect(validateNumber(42, 'field')).toBe(42);
  });

  it('throws for NaN', () => {
    expect(() => validateNumber(NaN, 'field')).toThrow(ValidationError);
  });

  it('throws for string', () => {
    expect(() => validateNumber('42' as unknown as number, 'field')).toThrow(ValidationError);
  });
});

describe('validateEmail', () => {
  it('returns valid email', () => {
    expect(validateEmail('user@example.com', 'email')).toBe('user@example.com');
  });

  it('throws for invalid email', () => {
    expect(() => validateEmail('not-email', 'email')).toThrow(ValidationError);
  });

  it('throws for email without domain', () => {
    expect(() => validateEmail('user@', 'email')).toThrow(ValidationError);
  });
});

describe('validateLength', () => {
  it('returns value within range', () => {
    expect(validateLength('hello', 1, 10, 'field')).toBe('hello');
  });

  it('throws for too short', () => {
    expect(() => validateLength('ab', 3, 10, 'field')).toThrow(ValidationError);
  });

  it('throws for too long', () => {
    expect(() => validateLength('a'.repeat(11), 1, 10, 'field')).toThrow(ValidationError);
  });
});

describe('validateEnum', () => {
  it('returns valid enum value', () => {
    expect(validateEnum('user', ['user', 'ai'], 'sender')).toBe('user');
  });

  it('throws for invalid enum value', () => {
    expect(() => validateEnum('other', ['user', 'ai'], 'sender')).toThrow(ValidationError);
  });
});
