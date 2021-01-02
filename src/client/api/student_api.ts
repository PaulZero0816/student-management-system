import { ApiResponse, BaseAPI } from "./base_api";
import { Student } from "../types";

const StudentAPIurlPrefix = "student";

class StudentAPI extends BaseAPI {
  async getStudentsByOrgId(id: number): Promise<Student[]> {
    const response = await this.get('get_students_info');
    return response.data;
  }

  createStudent = (
    student: {
      phone: string;
      wechat: string;
      name: string;
      comment: string;
    },
  ): Promise<ApiResponse<Student>> => {
    return this.postJSON("create", { student });
  };
}

export default new StudentAPI(StudentAPIurlPrefix);
