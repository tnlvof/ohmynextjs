import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('merges array inputs', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles object syntax', () => {
    expect(cn({ hidden: true, visible: false })).toBe('hidden');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});
