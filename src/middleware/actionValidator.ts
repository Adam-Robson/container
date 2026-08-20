import type { Dispatch } from 'react';
import type { AuthAction } from '../lib/auth-types';

/**
 * Set of valid action types for authentication actions.
 */
const validActionTypes = new Set<AuthAction['type']>([
  'LOGIN',
  'LOGOUT',
  'SET_LOADING',
  'SET_ERROR',
]);

/**
 * Middleware function to validate action
 * types before dispatching them.
 * @param dispatch
 * @returns A function that takes an action and dispatches it if valid.
 */
export default function actionValidator(dispatch: Dispatch<AuthAction>) {
  return (action: AuthAction) => {
    if (!validActionTypes.has(action.type)) {
      console.error(`Unexpected action type: ${action.type}`);
    }
    dispatch(action);
  };
}
