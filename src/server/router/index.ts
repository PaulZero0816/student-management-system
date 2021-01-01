import Router from "koa-router";
import responses from "../middlewares/response";
import apiRouter from "./api_router";
const routes = new Router();
routes.use(responses); // middleware to post-process responses
// Add Middleware
routes.use(apiRouter.routes()).use(apiRouter.allowedMethods());

export default routes;
