import adminAxios from "../utils/adminAxios";
import { 
    MY_ACCOUNT_INFO_URL, ADMIN_STATISTIC_URL,
} from "../settings";

class adminApi {
    myAccount = (params) => {
        return adminAxios.get(MY_ACCOUNT_INFO_URL, { params })
    }

    getStatistics = (params) => {
        return adminAxios.get(ADMIN_STATISTIC_URL, { params })
    }
}
export default new adminApi();