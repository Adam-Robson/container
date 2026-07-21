import type { AuthAction } from '../lib/auth-types';

const validActionTypes: string[] = [
  'LOGIN',
  'LOGOUT',
  'SET_LOADING',
  'SET_ERROR',
];

export default function actionValidator(dispatch: React.Dispatch<AuthAction>) {
  return (action: AuthAction) => {
    if (!validActionTypes.includes(action.type)) {
      console.error(`Unexpected action type: ${action.type}`);
    }
    dispatch(action);
  };
}
