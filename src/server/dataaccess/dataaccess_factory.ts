import dataAccess, { DataAccess, DataAccessKey } from "./index";
import { Context } from "../types/koa";
import sequelize, { Transaction } from "sequelize";

class DataaccessFactory {
  static getDataAccess<T extends keyof DataAccess>(
    ctx: Context,
    name: T,
    trx?: Transaction
  ): DataAccess[T] {
    if (!ctx) {
      throw "Can not trigger getDataAccess before calling handle";
    }
    return dataAccess(ctx, trx)[name];
  }

  /**
   * Return multi data access as an object
   * @param  [] names
   * @returns {Object} DA dataaccess object
   */
  static getMultiDataAccess(
    ctx: Context,
    names: readonly DataAccessKey[],
    trx?: sequelize.Transaction
  ): DataAccess {
    if (!ctx) {
      throw "Can not trigger getDataAccess before calling handle";
    }
    const DA = dataAccess(ctx, trx);
    return names.reduce((acc, name) => {
      acc[name] = DA[name];
      return acc;
    }, {} as DataAccess);
  }
}

export default DataaccessFactory;
const factoryGetMultiDataAccess = DataaccessFactory.getMultiDataAccess;
export { factoryGetMultiDataAccess as getMultiDataAccess };

const factoryGetDataAccess = DataaccessFactory.getDataAccess;
export { factoryGetDataAccess as getDataAccess };
