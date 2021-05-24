import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import userApi from '../../api/userApi';


let classes = makeStyles((theme) => ({
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
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Open and close modal
            isOpenModal: false,

            // Input data
            email: "",
            disableRequestEmailBtn: true,

            // Errors
            error: "",
            errorEmail: "",
        }
    }

    openModal = () => {
        this.setState({ isOpenModal: true });
    }
    isEmptyOrSpaces = (str) => {
        return str === null || str.match(/^ *$/) !== null;
    }

    validateEmail = async () => {
        let vnf_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const email = this.state.email;
        if (email.match(vnf_regex) && !this.isEmptyOrSpaces(email)) {
            await this.setState({ 
                errorEmail: "",
                disableRequestEmailBtn: false,
            });
        }
        else {
            if (this.isEmptyOrSpaces(email)) {
                await this.setState({ errorEmail: "Mục này không được để trống" });
            }
            else {
                await this.setState({ errorEmail: "Hãy nhập email hợp lệ" });
            }
        }
    }

    updateInputResetPassword = async (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        await this.setState({
            [name]: value
        });

        this.validateEmail();
    }

    handleHitEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleRequestEmail();
        }
    }

    handleRequestEmail = async () => {
        await this.validateEmail();
        if (this.state.errorEmail)
            return;
        this.setState({ disableRequestEmailBtn: true });
        this.setState({ error: "" });

        // When request otp succeed, change stage to verify and show modal verify otp.
        userApi.forgotPassword(this.state.email)
            .then(data => {
                if (data?.success) {
                    this.setState({ isOpenModal: true });
                }
            })
            .catch(async (error) => {
                if (error.response) {
                    console.error('Error:', error.response.data);
                    // setState for showing errors here.
                    await this.setState({ error: error.response.data['message'] })
                }
                else {
                    // Net work connection.
                    await this.setState({ error: "Oops. Đã có lỗi xảy ra. Hãy thử kiểm tra lại đường truyền kết nối của bạn nhé." })
                }
                this.setState({ disableRequestEmailBtn: false });
            });
    }

    render() {
        return (
            <table align="center" cellPadding={0} style={{ borderSpacing: 0, fontFamily: '"Muli",Arial,sans-serif', color: '#333333', margin: '0 auto', width: '100%', maxWidth: '600px' }}>
                <tbody>
                    {/* <tr>
                        <td align="center" className="vervelogoplaceholder" height={143} style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0, height: '143px', verticalAlign: 'middle' }} valign="middle"><span className="sg-image" ><a href="/" target="_blank"><img alt="Verve Wine" height={34} src="https://marketing-image-production.s3.amazonaws.com/uploads/79d8f4f889362f0c7effb2c26e08814bb12f5eb31c053021ada3463c7b35de6fb261440fc89fa804edbd11242076a81c8f0a9daa443273da5cb09c1a4739499f.png" style={{ borderWidth: '0px', width: '160px', height: '34px' }} width={160} /></a></span></td>
                    </tr> */}
                    {/* Start of Email Body*/}
                    <tr>
                        <td className="one-column" >
                            {/*[if gte mso 9]>
                    <center>
                    <table width="80%" cellpadding="20" cellspacing="30"><tr><td valign="top">
                    <![endif]*/}
                            <table style={{ borderSpacing: 0 }} width="100%">
                                <tbody>
                                    <tr>
                                        <td align="center" className="inner" style={{ paddingTop: '15px', paddingBottom: '15px', paddingRight: '30px', paddingLeft: '30px' }} valign="middle"><span className="sg-image" >
                                            <img alt="Forgot Password" className="banner-reset" height={120} src="https://image.freepik.com/free-vector/cute-panda-forgot-password-vector-icon-illustration_138676-419.jpg" style={{ borderWidth: '0px', width: '385px', height: '300px' }} width={255} /></span></td>
                                    </tr>
                                    <tr>
                                        <td className="inner contents center" >
                                            <center>
                                                <p className="h1 center" style={{ margin: 0, textAlign: 'center', fontFamily: '"flama-condensed","Arial Narrow",Arial', fontWeight: 100, fontSize: '30px', marginBottom: '26px' }}>Bạn quên mật khẩu?</p>

                                                <div className={classes.form} noValidate>
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                variant="outlined"
                                                                required
                                                                fullWidth
                                                                id="email"
                                                                label="Địa chỉ Email"
                                                                name="email"
                                                                autoComplete="0000000000"
                                                                onChange={this.updateInputResetPassword}
                                                                error={this.state.errorEmail ? true : false}
                                                                helperText={this.state.errorEmail}
                                                                size="normal"
                                                                InputProps={{
                                                                    classes: {
                                                                        input: classes.resize,
                                                                        label: classes.resize,
                                                                    },
                                                                }}
                                                                InputLabelProps={{
                                                                    classes: {
                                                                        root: classes.labelRoot,
                                                                        focused: classes.labelFocused
                                                                    }
                                                                }}
                                                                onKeyDown={this.handleHitEnter}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <span className="sg-image" data-imagelibrary="%7B%22width%22%3A%22260%22%2C%22height%22%3A54%2C%22alt_text%22%3A%22Reset%20your%20Password%22%2C%22alignment%22%3A%22%22%2C%22border%22%3A0%2C%22src%22%3A%22https%3A//marketing-image-production.s3.amazonaws.com/uploads/c1e9ad698cfb27be42ce2421c7d56cb405ef63eaa78c1db77cd79e02742dd1f35a277fc3e0dcad676976e72f02942b7c1709d933a77eacb048c92be49b0ec6f3.png%22%2C%22link%22%3A%22%23%22%2C%22classes%22%3A%7B%22sg-image%22%3A1%7D%7D">
                                                    <div>
                                                        {/* <img alt="Reset your Password" height={54} src="https://marketing-image-production.s3.amazonaws.com/uploads/c1e9ad698cfb27be42ce2421c7d56cb405ef63eaa78c1db77cd79e02742dd1f35a277fc3e0dcad676976e72f02942b7c1709d933a77eacb048c92be49b0ec6f3.png" style={{ borderWidth: '0px', marginTop: '30px', marginBottom: '50px', width: '355px', height: '54px' }} width={260} /> */}
                                                        <button className={"btn btn-secondary btn-lg"}
                                                            style={{ borderWidth: '0px', marginTop: '30px', marginBottom: '50px', width: '355px', height: '54px' }}
                                                            onClick={this.handleRequestEmail}
                                                        >
                                                            Gửi email khôi phục mật khẩu
                                                        </button>
                                                    </div>
                                                </span>
                                            </center>
                                            <Collapse in={this.state.error ? true : false}>
                                                <Alert severity="error">
                                                    <AlertTitle>Error</AlertTitle>
                                                    {this.state.error}
                                                </Alert>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Modal
                                show={this.state.isOpenModal}
                                backdrop="static"
                                keyboard={false}
                                aria-hidden='true'
                            >
                                <Modal.Body>
                                    <div id="wrapper">
                                        <div id="dialog">
                                            <h2>Xác thực email</h2>
                                            <span>Chúng tôi đã gửi hướng dẫn cho bạn. Hãy đi tới hộp thư của bạn và làm theo hướng dẫn.</span>
                                            <p>Email hướng dẫn lấy lại mật khẩu được gửi đến:</p>
                                            <span><b>{this.state.email}</b></span>
                                        </div>
                                        <Button
                                            variant="outlined" color="primary"
                                            onClick={() => {
                                                this.setState({
                                                    isOpenModal: false,
                                                    disableRequestEmailBtn: false,
                                                });
                                            }}
                                        >Chỉnh sửa email
                                        </Button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </td>
                    </tr>
                    {/* <tr>
                        <td height={40}>
                            <p style={{ lineHeight: '40px', padding: '0 0 0 0', margin: '0 0 0 0' }}>&nbsp;</p>
                            <p>&nbsp;</p>
                        </td>
                    </tr> */}
                    {/* whitespace */}
                    {/* <tr>
                        <td height={25}>
                            <p style={{ lineHeight: '25px', padding: '0 0 0 0', margin: '0 0 0 0' }}>&nbsp;</p>
                            <p>&nbsp;</p>
                        </td>
                    </tr> */}
                    {/* Footer */}
                    <tr>
                        <td style={{ paddingTop: 0, paddingBottom: 0, paddingRight: '30px', paddingLeft: '30px', textAlign: 'center', marginRight: 'auto', marginLeft: 'auto' }}>
                            <center>
                                <p style={{ fontFamily: '"Muli",Arial,sans-serif', margin: 0, textAlign: 'center', marginRight: 'auto', marginLeft: 'auto', paddingTop: '10px', paddingBottom: '0px', fontSize: '15px', color: '#a1a8ad', lineHeight: '23px' }}>Copyright © HappyCart 2021</p>
                            </center>
                        </td>
                    </tr>
                    {/* whitespace */}
                    <tr>
                        <td height={20}>
                            <p style={{ lineHeight: '20px', padding: '0 0 0 0', margin: '0 0 0 0' }}>&nbsp;</p>
                            {/* <p>&nbsp;</p> */}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ResetPassword;
