import Application, { ParameterizedContext, Request } from "koa";
import { IncomingMessage } from "http";

export type Session = {
  isAuthenticated: boolean;
  user: SessionUser;
  accessToken: any;
};

export interface SessionUser {
  id: string;
  sub: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
  orgId: number;
  org: string;
  "cognito:username": string;
  bucket: string;
}

export type Context = ParameterizedContext & {
  session: Session | null;
  accessToken?: string;
  request: Request;
  req: IncomingMessage;
  app?: Application;
};
