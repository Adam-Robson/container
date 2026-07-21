import { describe, expect, test, vi } from 'vitest';
import actionValidator from '../middlewares/actionValidator';

describe('actionValidator', () => {
  test('forwards known action types without logging', () => {
    const dispatch = vi.fn();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    actionValidator(dispatch)({ type: 'LOGOUT' });

    expect(dispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test('logs but still forwards actions with an unexpected type', () => {
    const dispatch = vi.fn();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // @ts-expect-error deliberately passing an invalid action type
    actionValidator(dispatch)({ type: 'UNKNOWN' });

    expect(consoleError).toHaveBeenCalledWith(
      'Unexpected action type: UNKNOWN',
    );
    expect(dispatch).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
