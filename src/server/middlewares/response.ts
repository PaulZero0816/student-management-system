import { ClientError } from "./clientError";

// @ts-ignore
export default async function (ctx, next) {
  try {
    // Call the next middleware
    await next();

    // Processing response results
    // If it is written directly in the body, it will not be processed.
    // If ctx.body is empty, use state as the response
    ctx.body = ctx.body || {
      code: ctx.state.code || 0,
      message: ctx.state.message || "",
      data: ctx.state.data || {},
    };
  } catch (e) {
    if (e instanceof ClientError) {
      // error that should be surfaced to client.
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
}
