import { SignType } from "../types";
import { ApiResponse, BaseAPI } from "./base_api";

const SignAPIurlPrefix = "sign";

class SignAPI extends BaseAPI {
    signStudents = (
        studentIds: number[],
        type: SignType,
        courseId: number
    ): Promise<ApiResponse<void>> => {
        return this.postJSON("students", { studentIds, type, courseId, orgId: 1 });
    };
}

export default new SignAPI(SignAPIurlPrefix);
