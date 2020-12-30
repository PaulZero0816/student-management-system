import Koa from "koa";
import serve from "koa-static";
import mount from "koa-mount";
import BodyParser from "koa-bodyparser";
import routes from "./router";

const app = new Koa();
const staticPages = new Koa();
staticPages.use(serve("dist"));
app.use(mount("/", staticPages));
app.use(BodyParser());

app.use(async (ctx, next) => {
  if (!ctx.request.headers?.traceid) {
    ctx = {
      ...ctx,
      request: {
        ...ctx.request,
        headers: {
          ...ctx.request?.headers,
        },
      },
    };
  }
  await next();
});

app.use(routes.routes()).use(routes.allowedMethods());
app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);

export default app;
