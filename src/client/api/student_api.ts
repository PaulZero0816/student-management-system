import { ApiResponse, BaseAPI } from "./base_api";
import { Student } from "../types";

const StudentAPIurlPrefix = "student";

class StudentAPI extends BaseAPI {
  async getStudentsByOrgId(id: number): Promise<Student[]> {
    const response = await this.get('get_students_info', { orgId: 1 });
    return response.data;
  }

  updateStudent = (
    id: number,
    student: {
      phone: string;
      wechat: string;
      name: string;
      comment: string;
    },
  ): Promise<ApiResponse<Student>> => {
    return this.postJSON("update", { student, id, orgId: 1 });
  };

  createStudent = (
    student: {
      phone: string;
      wechat: string;
      name: string;
      comment: string;
    },
  ): Promise<ApiResponse<Student>> => {
    return this.postJSON("create", { student, orgId: 1 });
  };
}

export default new StudentAPI(StudentAPIurlPrefix);
