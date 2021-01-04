import { Course } from "../types";
import { CourseModel } from "../db/course_model";
import { DataAccessBuilderProps } from "./index";
import { ClientError } from "../middlewares/clientError";

const dataAccessBuilder = (props: DataAccessBuilderProps) => {
    const { db, Op, buildQuery, trx } = props;
    return {
        create: async (courseSpec: Partial<Course>): Promise<CourseModel> => {
            try {
                const course = await db.courses.create(courseSpec, buildQuery());
                return course;
            } catch (e) {
                throw new ClientError("Create course Failed");
            }
        },

        update: async (id: number, orgId: number, courseSpec: Partial<Course>): Promise<CourseModel> => {
            try {
                const course = await db.courses.update(courseSpec, buildQuery({
                    where: { id: id, orgId: orgId }
                }));
                return course;
            } catch (e) {
                console.log(e);
                throw new ClientError("Update course Failed");
            }
        },

        findByOrgId: async (orgId: number): Promise<CourseModel[]> => {
            return db.courses.findAll(
                buildQuery({
                    where: { orgId: orgId },
                    raw: true,
                })
            );
        },
    };
};

export type CourseDataAccess = ReturnType<typeof dataAccessBuilder>;
export default dataAccessBuilder;
