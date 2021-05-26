import cookies from '../utils/cookie'
import axios from 'axios'
import qs from 'querystring'
import { TOKEN_URL, } from '../settings';



class Auth {
    constructor() {
        this.authenticated = false;
        this.isAdmin = false;
        this.authorization = ""
    }

    async verifyAccessToken(isAdmin) {
        if (isAdmin) {
            this.isAdmin = true;
            this.authorization = "admin_"
        }

        const refreshToken = cookies.get(this.authorization + 'refreshToken');

        if (cookies.get(this.authorization + 'accessToken') && Math.floor(Date.now()) <= cookies.get(this.authorization + 'expiredAt')) {
            return true
        }
        // If refreshToken are available => Do refresh
        else if (refreshToken) {
            let refreshResult = await this.refreshAccessToken(refreshToken);
            return refreshResult;
        }
        else {
            return false;
        }
    }

    async refreshAccessToken(token) {
        const refreshForm = {
            'refreshToken': token,
        };

        let config = {
            url: TOKEN_URL,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(refreshForm)
        };

        try {
            const res = await axios.request(config);

            if (res.data) {
                cookies.set(this.authorization + 'accessToken', res.data['accessToken'], { path: '/' });
                cookies.set(this.authorization + 'expiredAt', res.data['accessTokenExpiredAt'], { path: '/' });
                return true;
            }
        } catch (error) {
            if (error.response) {
                console.log("Refresh token failed.");
                console.log(error.response.data);
            }
        }
        return false;
    }

    logout = (callback) => {
        localStorage.removeItem('nameOfUser');

        //admin
        cookies.set('admin_accessToken', '', { path: '/' });
        cookies.set('admin_refreshToken', '', { path: '/' });
        // user
        cookies.set('accessToken', '', { path: '/' });
        cookies.set('refreshToken', '', { path: '/' });
        cookies.set('expiredAt', '', { path: '/' });
        // backend domain for sure <== this not works
        // cookies.set('accessToken', '', { path:  BASE_URL});
        // cookies.set('refreshToken', '', { path: BASE_URL });
        // cookies.set('expiredAt', '', { path: BASE_URL });

        callback();
    }
}

export default new Auth();
