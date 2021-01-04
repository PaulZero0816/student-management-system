import BaseController from "../shared_base_controller";

class PostUpdateCourseController extends BaseController {
    getMethod() {
        return "post";
    }

    getPath() {
        return "course/update";
    }

    getDescription() {
        return "Update course";
    }

    async getData() {
        const {
            name,
            orgId,
            id,
        }: {
            name: string
            orgId: number
            id: number
        } = this.params({
            name: 'string',
            orgId: 'int',
            id: 'int',
        });
        const coursesDA = this.getDataAccess("courses");
        const course = await coursesDA.update(id, orgId, {
            name: name,
        });
        return course;
    }
}

export default PostUpdateCourseController;
