import { ClientError } from "./clientError";

export default () =>
  async function (
    ctx: {
      body: { code?: any; message: any; data?: any; error?: any };
      state: { code: any; message: any; data: any };
      status: number;
    },
    next: () => any
  ) {
    try {
      await next();
      ctx.body = ctx.body || {
        code: ctx.state.code || 0,
        message: ctx.state.message || "",
        data: ctx.state.data || {},
      };
    } catch (e) {
      if (e instanceof ClientError || e.name === "ClientError") {
        ctx.status = e.httpStatusCode;
        ctx.body = {
          code: e.errorCode,
          message: e.message,
        };
      } else if ([401, 402].includes(e.status)) {
        ctx.status = e.status;
        ctx.body = {
          code: -1,
          message: e.message,
          error: e.message,
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          message: "Internal Error. Please try again later.",
        };
      }
    }
  };
