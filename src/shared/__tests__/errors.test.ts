import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  ExternalServiceError,
  handleError,
} from '@/shared/errors/AppError';

describe('AppError', () => {
  it('creates an AppError with correct properties', () => {
    const error = new AppError(400, 'Bad request', { field: 'email' });
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad request');
    expect(error.details).toEqual({ field: 'email' });
    expect(error.name).toBe('AppError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('ValidationError', () => {
  it('creates a 400 error', () => {
    const error = new ValidationError('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid input');
    expect(error.name).toBe('ValidationError');
  });
});

describe('NotFoundError', () => {
  it('creates a 404 error', () => {
    const error = new NotFoundError('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });
});

describe('UnauthorizedError', () => {
  it('creates a 401 error with default message', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });
});

describe('ExternalServiceError', () => {
  it('creates a 502 error with service name', () => {
    const error = new ExternalServiceError('Groq API');
    expect(error.statusCode).toBe(502);
    expect(error.message).toBe('External service error: Groq API');
  });
});

describe('handleError', () => {
  it('returns AppError as-is', () => {
    const error = new ValidationError('test');
    expect(handleError(error)).toBe(error);
  });

  it('wraps generic Error as InternalServerError', () => {
    const result = handleError(new Error('something broke'));
    expect(result).toBeInstanceOf(InternalServerError);
    expect(result.message).toBe('something broke');
  });

  it('wraps unknown values as InternalServerError', () => {
    const result = handleError('string error');
    expect(result).toBeInstanceOf(InternalServerError);
  });
});
