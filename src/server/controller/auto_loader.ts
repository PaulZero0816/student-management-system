import Router from "koa-router";
import SharedBaseController from "./shared_base_controller";
import glob from "glob";
import path from "path";

export default (controllerFolder: string, controllerClsToIgnore?: any) => {
  // Find all controllers
  // @ts-ignore
  const controllers = glob
    .sync(controllerFolder)
    // @ts-ignore
    .map((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const f = require(path.resolve(file));
      if (!f.default) {
        return;
      }
      const c = f.default;
      // @ts-ignore
      if (
        c.prototype instanceof SharedBaseController &&
        c !== SharedBaseController &&
        (!controllerClsToIgnore || c !== controllerClsToIgnore)
      ) {
        return c;
      }
    });
  // @ts-ignore
  const router = new Router();

  // @ts-ignore
  const methodToFunc = {
    get: router.get,
    post: router.post,
    head: router.head,
    put: router.put,
    delete: router.delete,
    patch: router.patch,
    options: router.options,
  };

  // @ts-ignore
  const register = (method, path, func) => {
    method = method.toLowerCase();
    if (!(method in methodToFunc)) {
      throw "Http method not implemented. Check your controller";
    }
    // @ts-ignore
    methodToFunc[method].bind(router)(path, func);
  };

  // @ts-ignore
  const routeSeen = new Set();

  // @ts-ignore
  controllers.map((controller) => {
    if (!controller) {
      return;
    }
    const c = new controller();
    if (c.isDisabled()) {
      return;
    }
    const method = c.getMethod().toLowerCase();
    let path = c.getPath();
    if (path.startsWith("/")) {
      // Remove redundant slash
      path = path.substr(1);
    }
    const routeKey = `${method}:${c.getPath()}`;
    if (routeSeen.has(routeKey)) {
      throw `Path ${c.getPath()} already exists for method ${method}`;
    }
    // @ts-ignore
    register(method, c.getPath(), async (ctx, next) => {
      const res = await c.handle(ctx, next);
      ctx.state.data = res;
    });
    routeSeen.add(routeKey);
  });
  return router;
};
