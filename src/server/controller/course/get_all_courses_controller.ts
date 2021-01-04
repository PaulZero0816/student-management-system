import BaseController from "../shared_base_controller";

class GetAllCoursesController extends BaseController {
    getMethod() {
        return "get";
    }

    getPath() {
        return "course/get_all";
    }

    getDescription() {
        return "Get all courses";
    }

    async getData() {
        const {
            orgId,
        }: {
            orgId: number
        } = this.params({
            orgId: 'int',
        });
        const coursesDA = this.getDataAccess("courses");
        const courses = await coursesDA.findByOrgId(orgId);
        return courses;
    }
}

export default GetAllCoursesController;
