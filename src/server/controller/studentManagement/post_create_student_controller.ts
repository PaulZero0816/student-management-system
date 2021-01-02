import BaseController from "../shared_base_controller";
import { StudentStatus } from "../../types";

class PostCreateStudentController extends BaseController {
  getMethod() {
    return "post";
  }

  getPath() {
    return "student/create";
  }

  getDescription() {
    return "Create student";
  }

  async getData() {
    const {
      student
    }: {
      student: {
        phone: string,
        wechat: string,
        name: string,
        comment: string,
      }
    } = this.params({
      student: 'object?',
    });
    console.log(student);
    const studentsDA = this.getDataAccess("students");
    const newStudent = await studentsDA.create({
      orgId: 1,
      status: StudentStatus.ACTIVE,
      ...student
    });
    return newStudent;
  }
}

export default PostCreateStudentController;
