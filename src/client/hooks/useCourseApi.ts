import fetchHookFactory from "./api/fetchHookFactory";
import CourseAPI from '../api/course_api'
export const [useCourseApi, refreshCourseApiCache] = fetchHookFactory(
    async (
        params: { orgId: number }
    ) => {
        return CourseAPI.getCoursesByOrgId();
    },
    {
        max: 5,
        maxAge: 1000 * 60 * 30, // 30 min
    },
);

export const createNewCourse = async (
    name: string
) => {
    await CourseAPI.createCourse(name);
    refreshCourseApiCache({ keys: 'refresh-all', swr: true });
};

export const updateCourse = async (
    id: number,
    name: string,
) => {
    await CourseAPI.updateCourse(id, name);
    refreshCourseApiCache({ keys: 'refresh-all', swr: true });
};