import Sequelize from "sequelize";
import base from "./base_dataaccess";
const { Op } = Sequelize;
import studentModule, { StudentDataAccess } from "./student_dataaccess";
import * as db from "../db";
import { Context } from "../types/koa";
import organizationModule, {
  OrganizationDataAccess,
} from "./organization_dataaccess";
import userModule, {
  UserDataAccess,
} from "./user_dataaccess";
import courseModule, {
  CourseDataAccess,
} from "./course_dataaccess";
import courseLogModule, {
  CourseLogDataAccess,
} from "./course_log_dataaccess";
export * from "./dataaccess_factory";

export type BuildQuery = (query?: Record<string, any>) => any;

export interface DataAccess {
  buildQuery: BuildQuery;
  conn: any;
  students: StudentDataAccess;
  organizations: OrganizationDataAccess;
  users: UserDataAccess;
  courses: CourseDataAccess;
  courseLogs: CourseLogDataAccess;
}
export type DataAccessKey = keyof DataAccess;
export type DataAccessBuilderProps = {
  db: any;
  Op: any;
  buildQuery: BuildQuery;
  ctx: Context;
  trx?: Sequelize.Transaction;
};
export type DataAccessBuilder<DataAccessInterface> = (
  props: DataAccessBuilderProps
) => DataAccessInterface;

const dataAccess: (ctx: Context, trx?: Sequelize.Transaction) => DataAccess = (
  ctx,
  trx
) => {
  const buildQuery: BuildQuery = (query = {}) => {
    return {
      ...query,
      ctx,
    };
  };
  const dataAccessProps = { db, Op, buildQuery, trx, ctx };
  return {
    buildQuery,
    conn: db.sequelize,
    students: studentModule(dataAccessProps),
    organizations: organizationModule(dataAccessProps),
    users: userModule(dataAccessProps),
    courses: courseModule(dataAccessProps),
    courseLogs: courseLogModule(dataAccessProps),
  };
};

export default dataAccess;
