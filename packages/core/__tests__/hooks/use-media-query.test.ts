import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '../../src/hooks/use-media-query';

describe('useMediaQuery', () => {
  let listeners: Array<(e: { matches: boolean }) => void>;
  let matchesMock: boolean;

  beforeEach(() => {
    listeners = [];
    matchesMock = false;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: matchesMock,
      media: query,
      addEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb);
      }),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('returns the initial match state', () => {
    matchesMock = true;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when query does not match', () => {
    matchesMock = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when media query changes', () => {
    matchesMock = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((cb) => cb({ matches: true }));
    });
    expect(result.current).toBe(true);
  });

  it('defaults to false for SSR (no window.matchMedia)', () => {
    const original = window.matchMedia;
    // @ts-expect-error - simulating SSR
    delete window.matchMedia;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    window.matchMedia = original;
  });
});
