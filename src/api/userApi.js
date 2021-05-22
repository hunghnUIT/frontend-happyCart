import userAxios from "../utils/userAxios";
import { LOGIN_URL, MY_ACCOUNT_INFO_URL, REGISTER_URL } from "../settings";
import qs from 'query-string';

class userApi {
    login = (email, password, deviceToken, asAdmin) => {
        const loginForm = {
            'email': email,
            'password': password,
            'deviceToken': deviceToken,
        };
        const url = LOGIN_URL + (asAdmin ? '?asAdmin=true': '');

        return userAxios.post(url, qs.stringify(loginForm), { customConfig: { needToken: false } });
    }

    myAccount = (params) => {
        return userAxios.get(MY_ACCOUNT_INFO_URL, { params })
    }

    register = (name, email, password) => {
        const registerForm = {
            'name': name,
            'email': email,
            'password': password,
        };

        return userAxios.post(REGISTER_URL, qs.stringify(registerForm));
    };
}
export default new userApi();