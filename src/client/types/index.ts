import { StyledComponentProps } from "@material-ui/styles/withStyles";
import { RouteComponentProps } from "react-router-dom";

export interface DefaultFormProps {
  isLoading: boolean;
  error: any;
  success: any;
  message: any;
}
export type StyledRoutedProps = Required<StyledComponentProps> &
  RouteComponentProps;
export type StyledRoutedFormComponentProps = StyledRoutedProps &
  DefaultFormProps;

export interface User {
  userName: string;
}
