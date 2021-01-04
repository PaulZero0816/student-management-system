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
      student,
      orgId,
    }: {
      student: {
        phone: string,
        wechat: string,
        name: string,
        comment: string,
        course: number,
      }
      orgId: number
    } = this.params({
      student: 'object?',
      orgId: 'int',
    });
    const studentsDA = this.getDataAccess("students");
    const courseLogDA = this.getDataAccess("courseLogs");
    const newStudent = await studentsDA.create({
      orgId: orgId,
      status: StudentStatus.ACTIVE,
      ...student
    });
    await courseLogDA.create({
      studentId: newStudent.id,
      comment: `初始化课时, 剩余课时 ${student.course}`,
      user: 1,
      orgId: orgId,
    })
    return newStudent;
  }
}

export default PostCreateStudentController;
