import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('reads an existing value from localStorage', () => {
    window.localStorage.setItem('key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  test('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('updated'));
  });

  test('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  test('falls back to the initial value when stored JSON is invalid', () => {
    window.localStorage.setItem('key', '{not valid json');
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });
});
