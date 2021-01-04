import { ApiResponse, BaseAPI } from "./base_api";
import { Course } from "../types";

const CourseAPIurlPrefix = "course";

class CourseAPI extends BaseAPI {
    async getCoursesByOrgId(): Promise<Course[]> {
        const response = await this.get('get_all', { orgId: 1 });
        return response.data;
    }

    updateCourse = (
        id: number,
        name: string,
    ): Promise<ApiResponse<Course>> => {
        return this.postJSON("update", { name, id, orgId: 1 });
    };

    createCourse = (
        name: string
    ): Promise<ApiResponse<Course>> => {
        return this.postJSON("create", { name, orgId: 1 });
    };
}

export default new CourseAPI(CourseAPIurlPrefix);
