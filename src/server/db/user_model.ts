import { Model, BuildOptions, DataTypes, Sequelize } from "sequelize";
import { User } from "../types";

export interface UserModel extends Model, User { }

type UserModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
};

export default function (sequelize: Sequelize): UserModelStatic {
    return sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            pass: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user",
        }
    ) as UserModelStatic;
}
