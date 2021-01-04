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

export interface Student {
  id: number;
  course: number;
  name: string;
  orgId: number;
  joinTime: string;
  comment: string;
  status: StudentStatus;
  phone: string;
  wechat: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  orgId: number;
}

export interface User {
  id: number;
  name: string;
  orgId: number;
  pass: string;
}

export interface CourseLog {
  studentId: number;
  orgId: number;
  comment: string;
  courseId: number;
  user: number;
  createdAt: string;
}

export enum StudentStatus {
  ACTIVE = "active",
}

export enum SignType {
  SIGN = "sign",
  MISS = "miss",
}