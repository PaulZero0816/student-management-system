import { Model, BuildOptions, DataTypes, Sequelize } from "sequelize";
import { Course } from "../types";

export interface CourseLogModel extends Model, Course { }

type CourseLogModelStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CourseLogModel;
};

export default function (sequelize: Sequelize): CourseLogModelStatic {
    return sequelize.define(
        "course_log",
        {
            studentId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: "student",
                    key: "id",
                },
                field: "student_id",
                primaryKey: true
            },
            courseId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "course",
                    key: "id",
                },
                field: "course_id",
            },
            comment: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            user: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user",
                    key: "id",
                },
            },
            createdAt: {
                type: DataTypes.TIME,
                defaultValue: Sequelize.fn("now"),
                field: "created_at",
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
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "course_log",
        }
    ) as CourseLogModelStatic;
}
