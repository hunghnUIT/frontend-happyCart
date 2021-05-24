import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';
import cookies from '../../utils/cookie'
import auth from '../../auth/auth';
import userApi from '../../api/userApi';
import adminApi from '../../api/adminApi';
import { Redirect } from 'react-router-dom'


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                HappyCart
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random/?online-shopping-mall)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

export default function SignInSide(props) {
    const classes = useStyles();
    const [email, setEmail] = React.useState(localStorage.getItem('email') ? localStorage.getItem('email') : "");
    const [pwd, setPwd] = React.useState(localStorage.getItem('password') ? localStorage.getItem('password') : "");
    const [disableLoginBtn, setDisableLoginBtn] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isShowAlert, setShowAlert] = React.useState(false);

    const [isValidateEmail, setIsValidateEmail] = React.useState(false);
    const [messageEmail, setMessageEmail] = React.useState("Email không được để trống");

    const [isValidatePwd, setIsValidatePwd] = React.useState(false);
    const [messagePwd, setMessagePwd] = React.useState("Mật khẩu không được để trống");

    const [isRememberChecked, setRemember] = React.useState(localStorage.getItem('email') ? true : false);
    const [isLoggedIn, setLoggedIn] = React.useState("");

    const [isLoginAsAdmin, setLoginAsAdmin] = React.useState(false);

    const validateEmail = () => {
        let vnf_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // let Email = event.target.value ? event.target.value : cookies.get('Email');
        if (isEmptyOrSpaces(email) | !email.match(vnf_regex)) {
            setIsValidateEmail(false);
            if (isEmptyOrSpaces(email)) {
                setMessageEmail("Email không được để trống");

            }
            else {
                setMessageEmail("Hãy nhập địa chỉ email hợp lệ");
            }
        }
        else {
            setIsValidateEmail(true);
            setMessageEmail("");
        }
    }

    const validatePassword = () => {
        if (isEmptyOrSpaces(pwd)) {
            setIsValidatePwd(false);
            setMessagePwd("Mật khẩu không được để trống");
        }
        else {
            setIsValidatePwd(true);
            setMessagePwd("");
        }
    };

    const updateInputEmail = (event) => {
        setEmail(event.target.value);
        // No need to validate after set value because validate email and pass func are used in useEffect()
        // validateEmail();
    }

    const updateInputPassword = (event) => {
        setPwd(event.target.value);
        // validatePassword();
    }

    const checkRemember = () => {
        setRemember(!isRememberChecked);
    }

    const handleLogin = async () => {
        const emailValue = email ? email : cookies.get("email");
        const pwdValue = pwd ? pwd : cookies.get("password");
        // temp for testing
        // await userApi.login(emailValue, pwdValue, null, true);


        let authorization = "";
        if (isLoginAsAdmin) {
            authorization = "admin_";
        }

        if (isValidateEmail && isValidatePwd) {
            setShowAlert(false);
            setError("");

            // Temporary disable btn after clicked.
            setDisableLoginBtn(true);

        //     await axios.request(configRequest)
            userApi.login(emailValue, pwdValue, null, isLoginAsAdmin)
                .then(async data => {
                    if (data) {
                        await cookies.set(authorization + 'accessToken', data['accessToken'], { path: '/' });
                        await cookies.set(authorization + 'refreshToken', data['refreshToken'], { path: '/' });
                        await cookies.set(authorization + 'expiredAt', data['accessTokenExpiredAt'], { path: '/' });

                        if (isRememberChecked) {
                            localStorage.setItem('email', emailValue);
                            localStorage.setItem('password', pwdValue);
                        }
                        else {
                            localStorage.setItem('email', "");
                            localStorage.setItem('password', "");
                        }
                        // props.history.push("/");
                        setLoggedIn(true);
                        return data['accessToken'];
                    }
                })
                .then(async () => {
                    let response;
                    if (!isLoginAsAdmin)
                        response = await userApi.myAccount().catch(err => console.log(err.message));
                    else
                        response = await adminApi.myAccount().catch(err => console.log(err.message));
                    if (response && response.success) {
                        localStorage.setItem('name', response.user.name);
                        await cookies.set(authorization + 'name', response.user.name, { path: '/' }); // For extension cuz having trouble in getting name from localStorage
                    }                    
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response) {
                        console.error('Error:', error.response.data);
                        // setState for showing errors here.
                        if (error.response.data['message'] === 'Account has been disable') {
                            setError("Tài khoản của bạn đã bị vô hiệu hóa")
                        }
                        else if (error.response.status === 401)
                            setError("Email hoặc mật khẩu không đúng.")
                        else if (error.response.status === 422)
                            setError("Hãy xác thực địa chỉ email của bạn để tiếp tục.")
                        else
                            setError(error.response.data['message']);
                    }
                    else {
                        setError("Oops. Đã có lỗi xảy ra. Hãy thử kiểm tra lại đường truyền kết nối của bạn nhé.");
                    }
                    setDisableLoginBtn(false);
                });
        }
        else {
            setShowAlert(true);
        }
    }

    const handleHitEnter = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    // Function below equal to componentDidMount
    useEffect(() => {
        if (props.location?.state?.loginAsAdmin || props.loginAsAdmin) {
            setLoginAsAdmin(true);
        }
    }, []); //eslint-disable-line

    useEffect(() => {
        const verifyProcess = async () => {
            let result;
            if (isLoginAsAdmin)
                result = await auth.verifyAccessToken(true);
            else
                result = await auth.verifyAccessToken();
            setLoggedIn(result);
        };
        if (!isLoggedIn)
            verifyProcess();
    }, [isLoggedIn]); //eslint-disable-line

    // Function below equal to componentDidUpdate
    useEffect(() => {
        // input email/pwd => update component => Validate <=> validate whenever input be updated.
        validateEmail();
        validatePassword();
    });

    const RedirectToDestinationOrActionIfAny = () => {
        if (props.location?.state?.to?.pathname) {
            if (props.location.state?.to?.state?.imgSrc) {
                return <Redirect
                    to={{
                        pathname: `${props.location.state.to.pathname}`,
                        state: {
                            from: props.location,
                            imgSrc: props.location.state.to.state.imgSrc
                        }
                    }}
                />
            }
            else {
                return (
                    <Redirect
                        to={{
                            pathname: `${props.location.state.to.pathname}`,
                            state: {
                                from: props.location
                            }
                        }} />
                )
            }
        }
        else if (props.location?.state?.action) {
            if (props.location.state.action === "addToCollection") {
                // addToCollection(props.location.state.imgSrc, props.location.state.thumbnail, props.location.state.type,
                    // props.location.state.platform, props.location.state.id, props.location.state.source);
            }
            else if (props.location.state.action === "downloadSingleImage") {
                // downloadImageByUrl(props.location.state.imgSrc);
            }
            return (
                <Redirect
                    to={{
                        pathname: "/",
                        state: {
                            from: props.location
                        }
                    }} />
            )
        }
        else if (props.loginAsAdmin) {
            return (
                <Redirect
                    to={{
                        pathname: '/admin/dashboard',
                        state: {
                            from: props.location
                        }
                    }} />
            )
        }
        else {
            return (
                <Redirect
                    to={{
                        pathname: "/",
                        state: {
                            from: props.location
                        }
                    }} />
            )
        }
    }

    return (
        isLoggedIn && isLoggedIn !== "" ?
            <RedirectToDestinationOrActionIfAny />
            :
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Đăng nhập
                        </Typography>
                        <div className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={updateInputEmail}
                                value={email}
                                error={!isValidateEmail}
                                helperText={messageEmail}
                                onKeyDown={handleHitEnter}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={updateInputPassword}
                                value={pwd}
                                error={!isValidatePwd}
                                helperText={messagePwd}
                                onKeyDown={handleHitEnter}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" checked={isRememberChecked} onClick={checkRemember} />}
                                label="Nhớ tài khoản và mật khẩu"
                            />
                            <Collapse in={((messageEmail || messagePwd) && isShowAlert) ? true : false}>
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    <p> {messageEmail} <br /> {messagePwd}</p>
                                </Alert>
                            </Collapse>
                            <Collapse in={error ? true : false}>
                                <Alert severity="error">
                                    <AlertTitle>Lỗi</AlertTitle>
                                    <p> {error} </p>
                                </Alert>
                            </Collapse>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={() => { handleLogin() }}
                                disabled={disableLoginBtn}
                            >
                                Đăng nhập
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/forgot-password" variant="body2">
                                        Quên mật khẩu?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Bạn chưa có tài khoản? Đăng ký ngay"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </div>
                    </div>
                </Grid>
            </Grid>
    );
}