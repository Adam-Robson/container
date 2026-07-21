import type { Reducer } from 'react';

export default function logger<S, A>(reducer: Reducer<S, A>): Reducer<S, A> {
  return (state: S, action: A) => {
    console.info('Before:', state);
    console.info('Action:', action);
    const newState = reducer(state, action);
    console.info('After:', newState);
    return newState;
  };
}
