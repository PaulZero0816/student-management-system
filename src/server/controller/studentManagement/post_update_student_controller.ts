import { ClientError } from "../../middlewares/clientError";
import BaseController from "../shared_base_controller";

class PostUpdateStudentController extends BaseController {
    getMethod() {
        return "post";
    }

    getPath() {
        return "student/update";
    }

    getDescription() {
        return "Update student";
    }

    async getData() {
        const {
            orgId,
            id,
            student,
        }: {
            orgId: number,
            id: number,
            student: {
                phone: string,
                wechat: string,
                name: string,
                comment: string,
                course: number,
            }
        } = this.params({
            orgId: 'int',
            id: 'int',
            student: 'object?',
        });
        const studentsDA = this.getDataAccess("students");
        const courseLogDA = this.getDataAccess("courseLogs");
        const { phone, wechat, name, comment, course } = student;
        const oldStudent = await studentsDA.findById(id, orgId);
        if (!oldStudent) {
            throw new ClientError('找不到学生');
        }
        if (oldStudent.course !== course) {
            await courseLogDA.create({
                studentId: id,
                comment: `修改课时, 剩余课时 ${course}`,
                user: 1,
                orgId: orgId,
            })
        }
        const newStudent = await studentsDA.update(id, {
            phone,
            wechat,
            name,
            comment,
            course
        });
        return newStudent;
    }
}

export default PostUpdateStudentController;
