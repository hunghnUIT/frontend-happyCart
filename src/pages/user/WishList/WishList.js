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
import 'bootstrap/dist/css/bootstrap.min.css';


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
    buttonSearch: {
        '&:hover': {
            backgroundColor: 'transparent',
        }
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
    const [count, setCount] = useState(0);

    // filter
    const [limit, setLimit] = useState(12);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({ limit, page });
    const [searchTerm, setSearchTerm] = useState('');
    // const [searchTerm, setSearchTerm] = useState('');
    // const [isTabDecreasedItems, setIsTabDecreasedItems] = useState(false);

    // Value selected
    const [listSelectedButtonSideBar, setListSelectedButtonSideBar] = useState(new Array(4).fill(false)); // Just 01 button selected at a moment
    const [valueRadioBtn, setValueRadioBtn] = React.useState('');

    const handleChangeRadioBtn = (event) => {
        setValueRadioBtn(event.target.value);
        let t;
        switch (event.target.value) {
            case 'asc-price':
                t = trackingItems.sort((a, b) => a.item.currentPrice - b.item.currentPrice)
                setTrackingItems(t);
                break;
            case 'desc-price':
                t = trackingItems.sort((a, b) => b.item.currentPrice - a.item.currentPrice)
                setTrackingItems(t);
                break;
            case 'most-decreased-price':
                t = trackingItems.sort((a, b) => b.item.lastPriceChange - a.item.lastPriceChange)
                setTrackingItems(t);
                break;
            default:
                break;
        }
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

    const handleSearchItem = () => {
        setFilter({
            ...filter,
            q: searchTerm,
        })
    }

    const handleLogout = () => {
        auth.logout(() => { props.history.push("/login") });
    }

    const handlePageChange = (event, newPage) => {
        // API provide newPage
        setPage(newPage + 1);
        setFilter({
            ...filter,
            page: newPage + 1,
        })
    };

    const handleHitEnter = (e)=>{
        if(e.key === 'Enter'){
            handleSearchItem();
        }
    }

    // Component did mount
    useEffect(() => {
        // Mark the first button is selected
        let temp = [...listSelectedButtonSideBar];
        temp[0] = true;
        setListSelectedButtonSideBar(temp);

        // Get name of user
        setNameOfUser(localStorage.getItem('name'));

        // NOTE When creating "filter" state, api fetched again so no need to fetch on did mount
        // userApi.getTrackingItems({}).then(resp => {
        //     if (resp.success) {
        //         let data = [];
        //         data = data.concat(resp.trackingItemsShopee);
        //         data = data.concat(resp.trackingItemsTiki);
        //         setTrackingItems(data);
        //     }
        // });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        userApi.getTrackingItems(filter).then(resp => {
            if (resp?.success) {
                let data = [];
                data = data.concat(resp.trackingItemsShopee);
                data = data.concat(resp.trackingItemsTiki);
                setTrackingItems(data);
                setCount(resp.count || 0);
            }
        });
    }, [filter])

    return (
        <div className="container">
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
                        S???n ph???m
                    </Typography>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[0] ? classes.selectedButtonSideBar : '')}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        id={0}
                        onClick={(e) => {
                            handleClickSideBarBtn(e);
                            setFilter({ page, limit });
                        }}
                    >
                        T???t c??? s???n ph???m
                    </Button>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[1] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        id={1}
                        onClick={(e) => {
                            handleClickSideBarBtn(e);
                            setFilter({
                                ...filter,
                                filter: 'decreasedOnly',
                            })
                        }}
                    >
                        S???n ph???m c?? gi?? gi???m
                    </Button>
                    {/* <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[2] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        value={2}
                        onClick={handleClickSideBarBtn}
                    >
                        S???n ph???m s??n Shopee
                    </Button>
                    <Button className={classes.buttonSideBar + ' ' + (listSelectedButtonSideBar[3] ? classes.selectedButtonSideBar : null)}
                        fullWidth
                        variant="contained"
                        disableElevation={true}
                        value={3}
                        onClick={handleClickSideBarBtn}
                    >
                        S???n ph???m s??n Tiki
                    </Button> */}

                    <FormControl component="fieldset">
                        <Typography gutterBottom variant="h6" component="h2">
                            S???p x???p
                        </Typography>
                        <RadioGroup aria-label="gender" name="gender1" value={valueRadioBtn} onChange={handleChangeRadioBtn}>
                            <FormControlLabel value="asc-price" control={<Radio />} label="Gi?? th???p ?????n cao" />
                            <FormControlLabel value="desc-price" control={<Radio />} label="Gi?? cao xu???ng th???p" />
                            <FormControlLabel value="most-decreased-price" control={<Radio />} label="Gi???m gi?? nhi???u nh???t" />
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
                            <div className="well">
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
                                            label="T??m ki???m s???n ph???m ??ang theo d??i"
                                            name="searched-item-name"
                                            style={{ marginTop: "0", marginBottom: "0" }}
                                            onKeyDown={handleHitEnter}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                            }}
                                            value={searchTerm}
                                        // error={!isValidateEmail}
                                        // helperText={messageEmail}
                                        />
                                    </Grid>
                                    <Grid item xs={1} className={classes.centerIcon}
                                        style={{ paddingLeft: '0' }}
                                    >
                                        <Button className={classes.searchComponent + ' ' + classes.buttonSearch}
                                            style={{ paddingLeft: '0' }}
                                            onClick={handleSearchItem}
                                        >
                                            <i className="fa fa-search"></i>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item sm={12} md={5}>
                            <ul className="shop__sorting">
                                <li className="active"><a href="./wish-list">??ang theo d??i</a></li>
                                <li><a href="#">{nameOfUser}</a></li> {/* eslint-disable-line */}
                                <li><a href="#" onClick={handleLogout}>????ng xu???t</a></li> {/* eslint-disable-line */}
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
                    <TablePagination
                        component="div"
                        count={count}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleLimitChange}
                        page={page - 1}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[6, 12, 24]}
                    />
                </Grid>
            </Grid>
        </div>
    )
}