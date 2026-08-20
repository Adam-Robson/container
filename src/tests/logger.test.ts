import { describe, expect, test, vi } from 'vitest';
import logger from '../reducer/logger';

describe('logger', () => {
  test('calls through to the wrapped reducer and returns its result', () => {
    const reducer = vi.fn(
      (state: number, _action: { type: string }) => state + 1,
    );
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});

    const result = logger(reducer)(1, { type: 'INCREMENT' });

    expect(result).toBe(2);
    expect(reducer).toHaveBeenCalledWith(1, { type: 'INCREMENT' });
    expect(consoleInfo).toHaveBeenCalled();
    consoleInfo.mockRestore();
  });
});
