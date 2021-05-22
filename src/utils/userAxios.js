import axios from 'axios';
import queryString from 'query-string';
import Cookies from './cookie'
import auth from '../auth/auth'


// set up default config for http requests here
const axiosClient = axios.create({
    headers: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
    },
    paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    const { needToken = true, contentType } = {...config.customConfig};
    delete config.customConfig; // Remove this made up config maybe better than keep them.

    if (needToken) {
        await auth.verifyAccessToken(); // Should verify every time request?
        config.headers['Authorization'] = `Bearer ${Cookies.get('accessToken')}`
    }
    if (contentType)
        config.headers['Content-Type'] = contentType;

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