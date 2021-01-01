import { Model, BuildOptions, DataTypes, Sequelize } from "sequelize";
import { Student, StudentStatus } from "../types";

export interface StudentModel extends Model, Student {}

type StudentModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): StudentModel;
};

export default function (sequelize: Sequelize): StudentModelStatic {
  return sequelize.define(
    "student",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "organization",
          key: "id",
        },
        field: "org_id",
      },
      joinTime: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.fn("now"),
        field: "join_time",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: StudentStatus.ACTIVE,
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      wechat: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "student",
    }
  ) as StudentModelStatic;
}
