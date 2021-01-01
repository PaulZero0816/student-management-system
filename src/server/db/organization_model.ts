import { Model, BuildOptions, DataTypes, Sequelize } from "sequelize";
import { Organization } from "../types";

export interface OrganizationModel extends Model, Organization {}

type OrganizationModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): OrganizationModel;
};

export default function (sequelize: Sequelize): OrganizationModelStatic {
  return sequelize.define(
    "student",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "organization",
    }
  ) as OrganizationModelStatic;
}
