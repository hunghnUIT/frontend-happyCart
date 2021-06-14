import adminAxios from "../utils/adminAxios";
import { 
    MY_ACCOUNT_INFO_URL, ADMIN_STATISTIC_URL,
    ADMIN_USER_URL,
} from "../settings";

class adminApi {
    myAccount = (params) => {
        return adminAxios.get(MY_ACCOUNT_INFO_URL, { params })
    }

    getStatistics = (params) => {
        return adminAxios.get(ADMIN_STATISTIC_URL, { params })
    }

    getUsers = (params) => {
        return adminAxios.get(ADMIN_USER_URL, { params })
    }

    deleteUser = (userId, params) => {
        return adminAxios.delete(`${ADMIN_USER_URL}/${userId}`, { params })
    }
}
export default new adminApi();