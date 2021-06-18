import adminAxios from "../utils/adminAxios";
import { 
    MY_ACCOUNT_INFO_URL, ADMIN_STATISTIC_URL,
    ADMIN_USER_URL, ADMIN_CONFIG_URL,
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

    getConfigs = (params) => {
        return adminAxios.get(ADMIN_CONFIG_URL, { params })
    }

    updateConfig = (configId, data) => {
        return adminAxios.put(`${ADMIN_CONFIG_URL}/${configId}`, JSON.stringify(data), { customConfig: { contentType: 'application/json' } })
    }

    createConfig = (data) => {
        return adminAxios.post(ADMIN_CONFIG_URL, JSON.stringify(data), { customConfig: { contentType: 'application/json' } })
    }
}
export default new adminApi();