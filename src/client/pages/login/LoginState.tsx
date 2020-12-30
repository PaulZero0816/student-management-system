import { LoginState } from "../../store/types";
export const initialState: LoginState = {
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("user_login"),
  error: null,
  success: null,
  message: null,
  user: null,
};
export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";
export const startLogin = () => ({
  type: START_LOGIN,
});

export default function LoginReducer(
  state = initialState,
  { type, payload }: { type: string; payload: object }
) {
  switch (type) {
    case START_LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}
