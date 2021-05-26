import React, { useEffect, useState } from 'react';
import userApi from '../../../api/userApi';
import ListItemCard from './ListItemCard';
import './WishList.css';
import {
    Box,
    Button,
    TablePagination,
    TextField,
    makeStyles,
    Grid,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Radio,
    Typography,
    Paper
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import auth from '../../../auth/auth';
import cookies from '../../../utils/cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, } from 'react-bootstrap';


const useStyles = makeStyles(theme => ({
    // Content
    logo: {
        maxWidth: 250,
        marginBottom: 1,
        boxShadow: 'none',
    },
    media: {
        height: 300,
    },
    title: {
        fontSize: 14,
    },
    centerIcon: {
        alignItems: 'center',
        textAlign: 'center',
    },
    searchComponent: {
        height: 45,
    },
    buttonSideBar: {
        backgroundColor: "transparent",
        margin: theme.spacing(0, 0, 1),
        height: 45,
        '&:hover': {
            backgroundColor: '#e2eaff',
            color: '#5e79cb',
        },
        alignItems: 'left',
        textAlign: 'left',
        borderRadius: 10,
        justifyContent: "flex-start",
    },
    selectedButtonSideBar: {
        backgroundColor: '#e2eaff',
        color: '#5e79cb',
    },
}));


export default function WishList(props) {
    const classes = useStyles();

    // Data
    const [trackingItems, setTrackingItems] = useState([]);
    const [nameOfUser, setNameOfUser] = useState('');

    // filter
    const [limit, setLimit] = useState(12);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState({});
    // const [searchTerm, setSearchTerm] = useState('');
    // const [isTabDecreasedItems, setIsTabDecreasedItems] = useState(false);

    // Value selected
    const [listSelectedButtonSideBar, setListSelectedButtonSideBar] = useState(new Array(4).fill(false)); // Just 01 button selected at a moment
    const [valueRadioBtn, setValueRadioBtn] = React.useState('');
    const [isShowModal, setShowModal] = useState(true);

    const handleChangeRadioBtn = (event) => {
        setValueRadioBtn(event.target.value);
    };

    const handleClickSideBarBtn = (event) => {
        let temp = [...listSelectedButtonSideBar];
        const idxOldSelected = temp.indexOf(true);
        temp[idxOldSelected] = false;
        temp[event.currentTarget.id] = true;
        setListSelectedButtonSideBar(temp);
    }

    const handleLimitChange = (event) => {
        const limit = event.target.value;
        setLimit(limit);
        setFilter({
            ...filter,
            limit: limit,
        })
    };

    // const handleChangePlatform = (platform) => {
    //     setFilter({
    //         ...filter,
    //         platform: platform,
    //     });
    // }

    const handleLogout = () => {
        auth.logout(() => { props.history.push("/login") });
    }

    const handlePageChange = (event, newPage) => {
        // API provide newPage
        setPage(newPage);
        setFilter({
            ...filter,
            offset: filter['limit'] * newPage,
        })
    };

    // Component did mount
    useEffect(() => {
        // Mark the first button is selected
        let temp = [...listSelectedButtonSideBar];
        temp[0] = true;
        setListSelectedButtonSideBar(temp);

        // Get name of user
        setNameOfUser(cookies.get('name'));

        userApi.getTrackingItems({}).then(resp => {
            if (resp.success) {
                let data = [];
                data = data.concat(resp.trackingItemsShopee);
                data = data.concat(resp.trackingItemsTiki);
                setTrackingItems(data);
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     if (!isTabDecreasedItems)
    //         userApi.getTrackingItems({});
    //     else
    //         userApi.getTrackingItems({ filter: 'decreasedPrice' });
    // }, [isTabDecreasedItems])

    return (
        <div class="container">
            <Grid container
                spacing={1}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item sm={4} md={3}>
                    <Paper style={{ boxShadow: 'none' }}>
                        <img className={classes.logo} src='/assets/images/logo.png' alt='logo'></img>
                    </Paper>
                    <Typography gutterBottom variant="h6" component="h2">
                        Sản phẩm
                    </Typography>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[0] ? classes.selectedButtonSideBar : '')}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        id={0}
                        onClick={handleClickSideBarBtn}
                    >
                        Tất cả sản phẩm
                    </Button>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[1] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        id={1}
                        onClick={handleClickSideBarBtn}
                    >
                        Sản phẩm có giá giảm
                    </Button>
                    {/* <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[2] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        value={2}
                        onClick={handleClickSideBarBtn}
                    >
                        Sản phẩm sàn Shopee
                    </Button>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[3] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        value={3}
                        onClick={handleClickSideBarBtn}
                    >
                        Sản phẩm sàn Tiki
                    </Button> */}

                    <FormControl component="fieldset">
                        <Typography gutterBottom variant="h6" component="h2">
                            Sắp xếp
                        </Typography>
                        <RadioGroup aria-label="gender" name="gender1" value={valueRadioBtn} onChange={handleChangeRadioBtn}>
                            <FormControlLabel value="asc-price" control={<Radio />} label="Giá thấp đến cao" />
                            <FormControlLabel value="desc-price" control={<Radio />} label="Giá cao xuống thấp" />
                            <FormControlLabel value="most-decreased-price" control={<Radio />} label="Giảm giá nhiều nhất" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item sm={8} md={9}>
                    <Grid container
                        spacing={2}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item sm={12} md={7}>
                            <div class="well">
                                <Grid container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Grid item xs={11}>
                                        <TextField
                                            InputProps={{
                                                className: classes.searchComponent
                                            }}
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            id="search-input"
                                            label="Search product"
                                            name="searched-item-name"
                                            style={{ marginTop: "0", marginBottom: "0" }}
                                        // onChange={updateInputEmail}
                                        // value={email}
                                        // error={!isValidateEmail}
                                        // helperText={messageEmail}
                                        // onKeyDown={handleHitEnter}
                                        />
                                    </Grid>
                                    <Grid item xs={1} className={classes.centerIcon}
                                        style={{ paddingLeft: '0' }}
                                    >
                                        <Button className={classes.searchComponent}
                                            style={{ paddingLeft: '0' }}
                                        >
                                            <i class="fa fa-search"></i>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item sm={12} md={5}>
                            <ul class="shop__sorting">
                                <li class="active"><a href="./wish-list">Đang theo dõi</a></li>
                                <li><a href="#">{nameOfUser}</a></li> {/* eslint-disable-line */}
                                <li><a href="#" onClick={handleLogout}>Đăng xuất</a></li> {/* eslint-disable-line */}
                            </ul>
                        </Grid>
                    </Grid>

                    <PerfectScrollbar>
                        <Box>
                            <ListItemCard
                                listItem={trackingItems}
                            />
                        </Box>
                    </PerfectScrollbar>
                    <Modal
                        show={isShowModal}
                        onHide={() => {setShowModal(false)}}
                        aria-hidden='true'
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Sản phẩm đang theo dõi giá</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Grid container
                                spacing={1}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} md={3}>
                                    hinh
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    thong tin
                                </Grid>
                            </Grid>
                        </Modal.Body>
                    </Modal>

                    <TablePagination
                        component="div"
                        count={trackingItems.length}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[6, 12, 24]}
                    />
                </Grid>
            </Grid>
        </div>
    )
}