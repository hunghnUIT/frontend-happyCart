import axios from 'axios';
import queryString from 'query-string';
import Cookies from './cookie';
import auth from '../auth/auth';


// set up default config for http requests here
const axiosClient = axios.create({
    headers: {
        'Authorization': `Bearer ${Cookies.get('admin_accessToken')}`,
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',

    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    await auth.verifyAccessToken()
    config.headers = {
        'Authorization': `Bearer ${Cookies.get('admin_accessToken')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
},
    error => {
        Promise.reject(error)
});

axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    //Handle error here
    throw error;
});

export default axiosClient;