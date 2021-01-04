import fetchHookFactory from "./api/fetchHookFactory";
import CourseLogAPI from '../api/course_log_api'
export const [useCourseLogApi, refreshCourseLogApiCache] = fetchHookFactory(
    async (
        params: { id: number }
    ) => {
        return CourseLogAPI.getCourseLogByStudentId(params.id);
    },
    {
        max: 10,
        maxAge: 1000 * 60 * 30, // 30 min
    },
);
