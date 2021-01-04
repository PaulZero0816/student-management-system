import BaseController from "../shared_base_controller";

class PostCreateCourseController extends BaseController {
    getMethod() {
        return "post";
    }

    getPath() {
        return "course/create";
    }

    getDescription() {
        return "Create course";
    }

    async getData() {
        const {
            name,
            orgId
        }: {
            name: string
            orgId: number
        } = this.params({
            name: 'string',
            orgId: 'int'
        });
        const coursesDA = this.getDataAccess("courses");
        const course = await coursesDA.create({
            name: name,
            orgId
        });
        return course;
    }
}

export default PostCreateCourseController;
