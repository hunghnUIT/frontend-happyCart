import userAxios from "../utils/userAxios";
import { LOGIN_URL, MY_ACCOUNT_INFO_URL, REGISTER_URL, FORGOT_PASSWORD_URL, TRACKING_ITEMS_URL } from "../settings";
import qs from 'query-string';

class userApi {
    login = (email, password, deviceToken, asAdmin) => {
        const loginForm = {
            'email': email,
            'password': password,
            'deviceToken': deviceToken,
        };
        const url = LOGIN_URL + (asAdmin ? '?asAdmin=true' : '');

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

    forgotPassword = (email) => {
        return userAxios.post(FORGOT_PASSWORD_URL, qs.stringify({ email: email }));
    }

    getTrackingItems = (params) => {
        return userAxios.get(TRACKING_ITEMS_URL, { params })
    }

    updateTrackedItem = (itemId, platform, notifyWhenPriceLt) => {
        const trackItemForm = {
            itemId,
            platform,
            notifyWhenPriceLt,
        }
        return userAxios.post(TRACKING_ITEMS_URL, qs.stringify(trackItemForm));
    }

    removeTrackedItem = (itemId, platform) => {
        return userAxios.delete(`${TRACKING_ITEMS_URL}/${itemId}?platform=${platform}`);
    }
}
export default new userApi();