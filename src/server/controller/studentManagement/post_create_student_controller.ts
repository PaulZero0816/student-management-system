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
    const studentsDA = this.getDataAccess("students");
    const student = await studentsDA.create({
      name: "paul",
      orgId: 1,
      comment: "test",
      status: StudentStatus.ACTIVE,
      phone: "138708753121",
      wechat: "qzq407594143",
    });
    console.log(student);
    return student;
  }
}

export default PostCreateStudentController;
