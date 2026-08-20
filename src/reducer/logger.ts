import type { Reducer } from 'react';

/**
 * Wraps a reducer to log each transition.
 */
export default function logger<S, A>(reducer: Reducer<S, A>): Reducer<S, A> {
  return (state: S, action: A): S => {
    const newState = reducer(state, action);
    console.groupCollapsed(
      `action ${(action as { type?: string })?.type ?? '(unknown)'}`,
    );
    console.info('prev state', state);
    console.info('action', action);
    console.info('next state', newState);
    console.groupEnd();
    return newState;
  };
}
