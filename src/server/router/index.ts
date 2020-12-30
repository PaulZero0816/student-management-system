import Router from "koa-router";
import responses from "../middlewares/response";
import routerLoader from "../controller/auto_loader";
import BaseController from "../controller/shared_base_controller";

const routes = new Router();
const allRouters = routerLoader(
  "./src/controllers/**/*_controller.ts",
  BaseController
);
const apiRouter = new Router({ prefix: "/api" });
apiRouter.use("/", allRouters.routes(), allRouters.allowedMethods());
// Add Middleware
routes.use(responses); // middleware to post-process responses
routes.use(apiRouter.routes()).use(apiRouter.allowedMethods());

export default routes;
