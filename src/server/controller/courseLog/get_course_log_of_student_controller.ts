import BaseController from "../shared_base_controller";

class GetStudentsCourseLogController extends BaseController {
    getMethod() {
        return "get";
    }

    getPath() {
        return "course_log/get_by_student";
    }

    getDescription() {
        return "Get student course log";
    }

    async getData() {
        const {
            orgId,
            studentId,
        }: {
            orgId: number
            studentId: number
        } = this.params({
            orgId: 'int',
            studentId: 'int',
        });
        const courseLogDA = this.getDataAccess("courseLogs");
        const courseLogs = await courseLogDA.findByStudentId(studentId, orgId);
        return courseLogs;
    }
}

export default GetStudentsCourseLogController;
