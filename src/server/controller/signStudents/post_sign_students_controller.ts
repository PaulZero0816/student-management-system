import BaseController from "../shared_base_controller";
import { CourseLog, SignType } from "../../types";

class PostSignStudentController extends BaseController {
    getMethod() {
        return "post";
    }

    getPath() {
        return "sign/students";
    }

    getDescription() {
        return "Sign students";
    }

    async getData() {
        const {
            studentIds,
            courseId,
            type,
            orgId,
        }: {
            studentIds: number[],
            type: SignType,
            courseId: number
            orgId: number
        } = this.params({
            studentIds: 'array',
            orgId: 'int',
            courseId: 'int',
            type: 'string',
        });
        const studentsDA = this.getDataAccess("students");
        const courseLogDA = this.getDataAccess("courseLogs");
        const students = await studentsDA.findByIds(orgId, studentIds);
        const newStudents = students.map((student) => {
            return {
                id: student.id,
                phone: student.phone,
                wechat: student.wechat,
                name: student.name,
                comment: student.comment,
                orgId: student.orgId,
                course: student.course - 1,
            }
        })
        await studentsDA.bulkUpsert(newStudents);
        const logs: Partial<CourseLog>[] = newStudents.map((student) => {
            return {
                studentId: student.id,
                orgId: 1,
                comment: type === SignType.SIGN ? `签到, 剩余课时 ${student.course}` : `缺勤, 剩余课时 ${student.course}`,
                courseId: courseId,
                user: 1
            }
        })
        await courseLogDA.bulkCreate(logs);
        return;
    }
}

export default PostSignStudentController;
