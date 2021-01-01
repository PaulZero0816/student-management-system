import BaseController from "../shared_base_controller";

class GetStudentsInfoController extends BaseController {
  getMethod() {
    return "get";
  }

  getPath() {
    return "student/get_students_info";
  }

  getDescription() {
    return "Get students info";
  }

  async getData() {
    const studentsDA = this.getDataAccess("students");
    const students = await studentsDA.findByOrgId(1);
    return students;
  }
}

export default GetStudentsInfoController;
