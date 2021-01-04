import { ApiResponse, BaseAPI } from "./base_api";
import { CourseLog } from "../types";

const CourseLogAPIurlPrefix = "course_log";

class CourseLogAPI extends BaseAPI {
    async getCourseLogByStudentId(studentId: number): Promise<CourseLog[]> {
        const response = await this.get('get_by_student', { studentId: studentId, orgId: 1 });
        return response.data;
    }

    createCourseLog = (
        courseLog: {
            studentId: number,
            courseId?: number,
            comment: string,
            user: number
        }
    ): Promise<ApiResponse<CourseLog>> => {
        return this.postJSON("create", { courseLog, orgId: 1 });
    };
}

export default new CourseLogAPI(CourseLogAPIurlPrefix);
