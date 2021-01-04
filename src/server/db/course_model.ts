import { Model, BuildOptions, DataTypes, Sequelize } from "sequelize";
import { Course } from "../types";

export interface CourseModel extends Model, Course { }

type CourseModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CourseModel;
};

export default function (sequelize: Sequelize): CourseModelStatic {
    return sequelize.define(
        "course",
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
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "course",
        }
    ) as CourseModelStatic;
}
