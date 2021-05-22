import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Modal, } from 'react-bootstrap';
import './Verify.css';
import userApi from '../../api/userApi';
import 'bootstrap/dist/css/bootstrap.min.css';



function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.facebook.com/profile.php?id=100008181729852">
                HappyCart
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 'lg'
    },
    paper: {
        marginTop: theme.spacing(8),
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    resize: {
        fontSize: 18,
    },
    labelRoot: {
        fontSize: 16,
    },
    labelFocused: {
        fontSize: 20,
    }
}));
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}
export default function SignUp(props) {
    const classes = useStyles();

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [password1, setPassword1] = React.useState("");
    const [disableRegisterBtn, setDisableRegisterBtn] = React.useState(false);
    const [error, setError] = React.useState("");
    // const [message, setMessage] = React.useState("");
    //  Error configuration
    const [errorName, setErrorName] = React.useState("");
    const [errorEmail, setErrorEmail] = React.useState("");
    const [errorPwd, setErrorPwd] = React.useState("");
    const [errorRetypePwd, setErrorRetypePwd] = React.useState("");
    // -------
    const [isOpenModal, setOpenModal] = React.useState(false);
    const [isShowAlert, setShowAlert] = React.useState(false);

    const updateInputRegister = async (e) => {
        switch (e.target.id) {
            case 'name':
                let name = e.target.value;
                setName(name);

                if (isEmptyOrSpaces(name))
                    setErrorName("Mục này là bắt buộc");
                else
                    setErrorName("");

                break;
            case 'email':
                let email = e.target.value;
                setEmail(email);

                let vnf_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (email.match(vnf_regex) && !isEmptyOrSpaces(email)) {
                    setErrorEmail('');
                }
                else {
                    if (isEmptyOrSpaces(email)) {
                        setErrorEmail('Mục này là bắt buộc');
                    }
                    else {
                        setErrorEmail('Hãy nhập địa chỉ email hợp lệ');
                    }
                }
                break;
            case 'password1':
                let password = e.target.value;
                setPassword1(password);

                if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) && !isEmptyOrSpaces(password)) {
                    setErrorPwd('');
                }
                else {
                    if (isEmptyOrSpaces(password)) {
                        setErrorPwd('Mục này là bắt buộc');
                    }
                    else {
                        setErrorPwd('Mật khẩu cần chứa tối thiểu 8 ký tự, trong đó tối thiểu có 1 chữ số, 1 chữ hoa và 1 chữ thường');
                    }
                }
                break;
            case 'password2':
                let rePwd = e.target.value;

                if (rePwd === password1 && !isEmptyOrSpaces(rePwd)) {
                    setErrorRetypePwd('');
                }
                else {
                    if (isEmptyOrSpaces(rePwd)) {
                        setErrorRetypePwd('Mục này là bắt buộc');
                    }
                    else setErrorRetypePwd('Nhập lại mật khẩu không khớp');
                }
                break;
            default:
                break;
        }
    }

    const handleShowAndCloseModal = () => {
        setOpenModal(!isOpenModal);
    }

    const handleRegister = async () => {
        if (errorName || errorEmail || errorRetypePwd || errorPwd) {
            return;
        }

        // Temporary disable btn after clicked.
        setDisableRegisterBtn(true);

        userApi.register(name, email, password1)
            .then(data => {
                if (data['success'] === true) {
                    // countDown(60);

                    // if (!resendOtp) {
                    handleShowAndCloseModal();
                    // }
                    // setMessage(data['message']);
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Error:', error.response.data);

                    setError(error.response.data['message']);
                    // Sẽ disable nút resend code ở đây, sử dụng lại cái setDisableRegisterBtn cũng được, dùng setTimeOut các kiểu.
                }
                else {
                    setError("Oops. Đã có lỗi xảy ra. Hãy thử kiểm tra lại đường truyền kết nối của bạn nhé.");
                }
                setDisableRegisterBtn(false);
                setShowAlert(true);
            });
    }

    const handleHitEnter = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Đăng ký tài khoản
                </Typography>
                <div className={classes.form} noValidate>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                autoComplete="fname"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Họ và tên"
                                autoFocus
                                onChange={updateInputRegister}
                                size="normal"
                                error={errorName ? true : false}
                                helperText={errorName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Địa chỉ Email"
                                name="email"
                                autoComplete="0000000000"
                                onChange={updateInputRegister}
                                error={errorEmail ? true : false}
                                helperText={errorEmail}
                                size="normal"
                                placeHolder="(example@gmail.com)"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password1"
                                autoComplete="current-password"
                                onChange={updateInputRegister}
                                error={errorPwd ? true : false}
                                helperText={errorPwd}
                                size="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Nhập lại mật khẩu"
                                type="password"
                                id="password2"
                                autoComplete="current-password"
                                onChange={updateInputRegister}
                                error={errorRetypePwd ? true : false}
                                helperText={errorRetypePwd}
                                size="normal"
                            />
                        </Grid>
                    </Grid>
                    <Collapse in={isShowAlert}>
                        <Alert severity="error"
                        >
                            <AlertTitle>Lỗi</AlertTitle>
                            {errorName ? errorName : error} — <strong>check it out!</strong>
                        </Alert>
                    </Collapse>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => { handleRegister(false) }}
                        disabled={disableRegisterBtn}
                        onKeyDown={handleHitEnter}>
                        Đăng ký
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Bạn đã có tài khoản? Đăng nhập ngay
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
            <Modal
                show={isOpenModal}
                onHide={handleShowAndCloseModal}
                backdrop="static"
                keyboard={false}
                aria-hidden='true'
            >
                <Modal.Body>
                    <div id="wrapper">
                        <div id="dialog">
                            <h2>Xác thực email</h2>
                            <span>Bạn cần phải xác thực email để tiếp tục. Hãy đi tới hộp thư của bạn và làm theo hướng dẫn.</span>
                            <p>Email xác thực được gửi đến:</p>
                            <span><b>{email}</b></span>
                        </div>
                        <Button 
                            variant="outlined" color="primary"
                            onClick={() => {
                                handleShowAndCloseModal();
                                setDisableRegisterBtn(false)
                            }}
                        >Chỉnh sửa email
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

        </Container>

    );
}