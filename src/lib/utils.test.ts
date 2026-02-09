import { describe, it, expect } from 'vitest';
import { cn, APP_NAME, MIN_PASSWORD_LENGTH } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });
});

describe('constants', () => {
  it('has APP_NAME', () => {
    expect(APP_NAME).toBe('OhMyNextJS');
  });

  it('has MIN_PASSWORD_LENGTH', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(6);
  });
});
