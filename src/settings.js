const BASE_URL = 'https://519bb137df6144dcbeda18e87d53ad8a-0-s-80.vlab.uit.edu.vn';
const API_V1_URL = BASE_URL + '/api/v1'

// Authenticating
const AUTH_URL = API_V1_URL + '/auth'
const LOGIN_URL = AUTH_URL + "/login";
const REGISTER_URL = AUTH_URL + "/register";
const TOKEN_URL = AUTH_URL+"/token";
const FORGOT_PASSWORD_URL = AUTH_URL + "/forgot-password";

// User
const USER_URL = API_V1_URL + '/user';
const MY_ACCOUNT_INFO_URL = USER_URL + '/my-account';
const TRACKING_ITEMS_URL = USER_URL + '/tracking-items';


// Admin
const ADMIN_URL = API_V1_URL + '/admin';
const ADMIN_USER_URL = ADMIN_URL + '/users';
// const ADMIN_LOG_URL = ADMIN_URL + "/logs";
const ADMIN_STATISTIC_URL = ADMIN_URL + "/statistics";


// const VERIFY_RESET_PASSWORD_URL = RESET_PASSWORD_URL + "/verify";

// const MY_ACCOUNT_INFO_URL = BASE_URL + "/me";
// const UPDATE_MY_ACCOUNT_INFO_URL = MY_ACCOUNT_INFO_URL + "/update";
// const MY_AVATAR_URL = MY_ACCOUNT_INFO_URL + "/avatar";
// const COLLECTIONS_URL = MY_ACCOUNT_INFO_URL + "/collections";
// const HISTORY_URL = MY_ACCOUNT_INFO_URL + "/logs";

export { 
    BASE_URL,
    LOGIN_URL,
    REGISTER_URL,
    TOKEN_URL,
    FORGOT_PASSWORD_URL,
    MY_ACCOUNT_INFO_URL,
    TRACKING_ITEMS_URL,
    ADMIN_USER_URL,
    ADMIN_STATISTIC_URL,
};