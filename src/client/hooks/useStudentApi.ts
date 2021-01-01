import fetchHookFactory from "./api/fetchHookFactory";
import StudentAPI from '../api/student_api'
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
