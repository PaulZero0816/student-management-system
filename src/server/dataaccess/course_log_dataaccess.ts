import { CourseLog } from "../types";
import { CourseLogModel } from "../db/course_log_model";
import { DataAccessBuilderProps } from "./index";
import { ClientError } from "../middlewares/clientError";

const dataAccessBuilder = (props: DataAccessBuilderProps) => {
    const { db, Op, buildQuery, trx } = props;
    return {
        create: async (courseLogSpec: Partial<CourseLog>): Promise<CourseLogModel> => {
            try {
                const courseLog = await db.courseLogs.create(courseLogSpec, buildQuery());
                return courseLog;
            } catch (e) {
                console.log(e);
                throw new ClientError("Create course log Failed");
            }
        },

        findByStudentId: async (
            studentId: number,
            orgId: number
        ): Promise<CourseLogModel[]> => {
            return db.courseLogs.findAll(
                buildQuery({
                    where: { studentId: studentId, orgId: orgId },
                    raw: true,
                })
            );
        },

        bulkCreate: (logs: Partial<CourseLogModel>[]) => {
            try {
                return db.courseLogs.bulkCreate(
                    logs,
                    buildQuery({
                        returning: true,
                    }),
                );
            } catch (e) {
                console.log(e);
                throw new ClientError("Create Course Log Failed");
            }
        },
    };
};

export type CourseLogDataAccess = ReturnType<typeof dataAccessBuilder>;
export default dataAccessBuilder;
