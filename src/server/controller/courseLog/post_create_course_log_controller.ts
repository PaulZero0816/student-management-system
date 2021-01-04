import { Course, CourseLog } from "../../types";
import BaseController from "../shared_base_controller";

class PostCreateCourseLogController extends BaseController {
    getMethod() {
        return "post";
    }

    getPath() {
        return "course_log/create";
    }

    getDescription() {
        return "Create course log";
    }

    async getData() {
        const {
            courseLog,
            orgId,
        }: {
            courseLog: Partial<CourseLog>
            orgId: number
        } = this.params({
            courseLog: 'object?',
            orgId: 'int',
        });
        const courseLogsDA = this.getDataAccess("courseLogs");
        const log = await courseLogsDA.create({
            orgId: orgId,
            ...courseLog
        });
        return log;
    }
}

export default PostCreateCourseLogController;
