import { SignType } from '../types';
import SignAPI from '../api/sign_students_api'
import { refreshCourseLogApiCache } from './useCourseLogApi';
import { refreshStudentsInfoApiCache } from './useStudentApi';


export const signStudents = async (
    studentIds: number[],
    type: SignType,
    courseId: number,
) => {
    await SignAPI.signStudents(studentIds, type, courseId);
    refreshStudentsInfoApiCache({ keys: 'refresh-all', swr: true });
    refreshCourseLogApiCache({ keys: 'refresh-all', swr: true });
};