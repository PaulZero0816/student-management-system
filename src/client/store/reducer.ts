import { combineReducers, AnyAction, CombinedState } from "redux";

import login from "../pages/login/LoginState";

import { ReduxStates } from "./types";
const appReducer = combineReducers<ReduxStates>({
  login,
});

export default function rootReducer(
  state: CombinedState<ReduxStates> | undefined,
  action: AnyAction
) {
  return appReducer(state, action);
}
