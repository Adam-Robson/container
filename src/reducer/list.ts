import type { Reducer, ReducerAction, ReducerState } from 'react';

export default function logger<S, A>(reducer: Reducer<S, A>): Reducer<S, A> {
  return (
    state: ReducerState<Reducer<S, A>>,
    action: ReducerAction<Reducer<S, A>>,
  ) => {
    console.info(`Before: ${state}`);
    console.info(`After: ${action}`);
    const newState = reducer(state, action);
    console.info(`Result: ${newState}`);
    return newState;
  };
}
