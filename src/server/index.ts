import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Logger from "koa-logger";
//@ts-ignore
import formidable from "koa2-formidable";
import cors from "@koa/cors";
import serve from "koa-static";
import mount from "koa-mount";
import routes from "./router";
const app = new Koa();

// client static serving
const staticPages = new Koa();
staticPages.use(
  serve("../../dist", {
    extensions: ["html", "css", "png"],
  })
);

app.use(mount("/", staticPages));
/** subpath starts with /app will be redirected to front-end
 */

app
  .use(async (ctx, next) => {
    console.log(ctx.request.path)
    if (ctx.request.path.startsWith('/app') || ctx.request.path.startsWith('/login')) {
      ctx.request.path = '/';
    }
    await next();
  })
  .use(serve('../../dist'));

app.use(formidable({})); // allow accept form-data with files
app.use(BodyParser());

app
  .use(async (ctx, next) => {
    if (
      ctx.request.path.startsWith("/app") ||
      ctx.request.path.startsWith("/login")
    ) {
      ctx.request.path = "/";
    }
    await next();
  })
  .use(serve("dist"));

app.use(Logger());
app.use(cors());

app.use(routes.routes()).use(routes.allowedMethods());
console.log(routes.stack.map((i) => i.path));

app.listen(3000, () => {
  console.info(`==> 🌎 Server running, URL: http://localhost:${3000}/`);
});

export default app;
