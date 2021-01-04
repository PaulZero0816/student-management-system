import fetchHookFactory from "./api/fetchHookFactory";
import StudentAPI from '../api/student_api'
import { refreshCourseLogApiCache } from "./useCourseLogApi";
export const [useStudentsInfoApi, refreshStudentsInfoApiCache] = fetchHookFactory(
  async (
    params: { orgId: number }
  ) => {
    return StudentAPI.getStudentsByOrgId(params.orgId);
  },
  {
    max: 5,
    maxAge: 1000 * 60 * 30, // 30 min
  },
);

export const createNewStudent = async (
  student: {
    phone: string;
    wechat: string;
    name: string;
    comment: string;
    course: number;
  }
) => {
  await StudentAPI.createStudent(student);
  refreshStudentsInfoApiCache({ keys: 'refresh-all', swr: true });
  refreshCourseLogApiCache({ keys: 'refresh-all', swr: true });
};

export const updateStudent = async (
  id: number,
  student: {
    phone: string;
    wechat: string;
    name: string;
    comment: string;
    course?: number;
  }
) => {
  await StudentAPI.updateStudent(id, student);
  refreshStudentsInfoApiCache({ keys: 'refresh-all', swr: true });
  refreshCourseLogApiCache({ keys: 'refresh-all', swr: true });
};