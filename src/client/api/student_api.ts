import { ApiResponse, BaseAPI } from "./base_api";
import { Student } from "../types";

const StudentAPIurlPrefix = "student";

class StudentAPI extends BaseAPI {
  async getStudentsByOrgId(id: number): Promise<ApiResponse<Student[]>> {
    const response = await this.get('get_students_info');
    return { ...response, data: response.data };
  }

  createMedia = async (
    student: Partial<Student>
  ): Promise<ApiResponse<Student>> => {
    return await this.postJSON("create", student);
  };
}

export default new StudentAPI(StudentAPIurlPrefix);
