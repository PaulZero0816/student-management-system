// @ts-ignore
import Parameter from "parameter";
import { ClientError } from "../middlewares/clientError";
import { Context, Session } from "../types/koa";
import { ParamType } from "../types/controller";
import { DataAccess, DataAccessKey } from "../dataaccess";
import DataaccessFactory from "../dataaccess/dataaccess_factory";
import { Transaction } from "sequelize";
export interface Controller {
  getPath(): string | void;
  getMethod(): string | void;
  getDescription(): string | void;
  getSession(): Session;
  getDataAccess<V extends DataAccessKey>(name: V): DataAccess[V];
  getMultiDataAccess(...args: DataAccessKey[]): Partial<DataAccess>;
  getUserId(): string;
  getOrgId(): number;
  getContext(): Context;
  isDisabled(): boolean;
}

/** these parsers are to ensure
 *  that passed parameters are in the right format
 *  and can be parsed into the right format in order
 *  to pass parameter validation steps
 */
const paramParsers: {
  validator: (value: string, type: ParamType) => boolean;
  parse: (value: string) => any;
}[] = [
  {
    validator: (value, type) => {
      return (
        ["int", "int?"].includes(type.toString()) && /^-?\d*\.?\d+$/.test(value)
      );
    },
    parse: (value) => {
      return Number(value);
    },
  },
  {
    validator: (value, type) => {
      return (
        ["bool", "bool?"].includes(type.toString()) &&
        ["true", "false"].includes(value)
      );
    },
    parse: (value) => {
      return value === "true";
    },
  },
  {
    // for GET request, format of the value given from the client
    // is in format "1,2,3,4", which need to be parsed into [1,2,3,4]
    validator: (value, type) => {
      return (
        ["array", "array?"].includes(type.toString()) &&
        /\w+(,\w+)*/.test(value)
      );
    },
    parse: (value) => {
      return value.replace(/ /g, "").split(",");
    },
  },
  {
    validator: (_value, type) => {
      return ["object", "object?"].includes(type.toString());
    },
    parse: (value) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
  },
];

abstract class BaseController implements Controller {
  protected ctx?: Context;

  /*
    path of the controller. For eg. text/get/
     */
  getPath(): string {
    throw "getPath not implemented";
  }

  /*
      get, post, put ...
     */
  getMethod(): string {
    throw "getMethod not implemented";
  }

  clientError(message: string, httpStatusCode = 400, errorCode = -1): never {
    throw new ClientError(message, httpStatusCode, errorCode);
  }

  getDescription(): string {
    throw "getDescription not implemented";
  }

  getContext(): Context {
    return this.ctx!;
  }

  getSession(): Session {
    return this?.ctx?.session as Session;
  }

  getDataAccess<V extends DataAccessKey>(
    name: V,
    trx?: Transaction
  ): DataAccess[V] {
    return DataaccessFactory.getDataAccess(this.ctx!, name, trx);
  }

  /**
   * Return multi data access as an object
   * @returns {Object} DA dataaccess object
   * @param args
   */
  getMultiDataAccess<K extends DataAccessKey>(
    ...args: K[]
  ): Pick<DataAccess, K> {
    return DataaccessFactory.getMultiDataAccess(this.ctx!, args);
  }

  getUserId() {
    // @ts-ignore
    return this.ctx.session.user.id;
  }

  getUserEmail(): string | undefined | null {
    return this.ctx?.session?.user.email;
  }

  getOrgId() {
    // @ts-ignore
    return this.ctx.session.user.orgId;
  }

  isDisabled() {
    // If set to true, then the controller will not be picked up by router.
    return false;
  }

  /*
    Type API can be found here: https://github.com/node-modules/parameter
    For eg, int or int?
     */
  param(paramName: string, type: ParamType): any {
    if (!this.ctx) {
      throw "Can not trigger getParam before calling handle";
    }
    const method = this.ctx.method.toUpperCase();
    let params: Record<string, any> = {};
    if (!["GET", "HEAD"].includes(method)) {
      params = this.ctx.request.body || {};
    }
    params = Object.assign(
      params,
      this.ctx.request.query || {},
      this.ctx.params || {}
    );

    const paramValue = params[paramName];
    // for every parser, if match type and validation,
    // value will be adjusted into the right format
    for (const { validator, parse } of paramParsers) {
      if (typeof paramValue === "string") {
        const valid = validator(paramValue, type);
        if (valid) {
          params[paramName] = parse(paramValue);
          break; // only one type possible
        }
      }
    }
    const errors = new Parameter().validate(
      { [paramName]: type },
      Object.assign({}, params)
    );
    if (!errors || errors.length === 0) {
      return params[paramName];
    }
    const errorMsg = errors[0].message;
    this.clientError(`Invalid parameter: '${paramName}'. ${errorMsg}`);
  }

  params<K extends string>(
    paramNameToTypes: Record<K, ParamType>
  ): Record<K, any> {
    const res = {} as Record<K, any>;
    for (const [param, type] of Object.entries(paramNameToTypes)) {
      // @ts-ignore
      res[param] = this.param(param, type);
    }
    return res;
  }

  abstract getData(): Promise<Record<string, any> | void | null | string>;

  async handle(ctx: Context) {
    this.ctx = ctx;
    return await this.getData();
  }
}

export default BaseController;
