import Router from "koa-router";
import routerLoader from "../controller/auto_loader";
import BaseController from "../controller/shared_base_controller";
// Add Nested Routers
const allRouters = routerLoader("./**/*_controller.ts", BaseController);
const apiRouter = new Router({ prefix: "/api" });

apiRouter.use("/", allRouters.routes(), allRouters.allowedMethods());

export default apiRouter;
