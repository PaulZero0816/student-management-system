import { DefaultFormProps, User } from "../types";

export interface LoginState extends DefaultFormProps {
  isAuthenticated: boolean;
  user: Partial<User> | null;
}

export interface ReduxStates {
  login: LoginState;
}
