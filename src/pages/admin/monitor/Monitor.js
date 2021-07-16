import React, { useEffect, useState } from "react";
import {
    Card, IconButton,
    Typography, Grid,
    Tooltip, Box,
    Menu, MenuItem,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { TinyDonutChart } from "./TinyDonutChart";
import { Row, Container } from 'shards-react';
import PageTitle from '../../../components/common/PageTitle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';

import adminApi from '../../../api/adminApi';

const crawlerOptions = ['Khởi động lại'];

const useStyles = makeStyles(theme => ({
    root: {
    },
    fadeText: {
        color: '#8493b9',
    },
    actionCrawler: {
        padding: 0,
        marginLeft: '0.5rem',
    },
    cardContainer: {
        display: 'grid',
    },
    cardContent: {
        gridArea: '1 / 1',
    },
    backdrop: {
        // For overlay
        gridArea: '1 / 1',
        zIndex: '2', /* Sit on top */
        backgroundColor: '#fff', //'#5a6169', /* Black w/ opacity */
        opacity: '0.85',

        // for message:
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const NoMarginToolTip = withStyles({
    tooltip: {
        margin: 0,
    }
})(Tooltip);

/**
<div className="justify-content-between">
    <p className="d-flex align-items-center mb-0 mt-2">Tổng mức sử dụng CPU</p>
    <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={74}/>
        </Box>
        <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
            74
            )}%`}</Typography>
        </Box>
    </Box>
    </div>
    <div className="justify-content-between">
    <p className="d-flex align-items-center mb-0 mt-3">Mức sử dụng CPU của Crawler</p>
    <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
            <LinearProgress variant="determinate" value={44}/>
        </Box>
        <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
            44
            )}%`}</Typography>
        </Box>
    </Box>
</div>
 */

export default function Monitor() {
    const classes = useStyles();

    // For data
    const [data, setData] = useState({});

    // For menu action crawler.
    const [anchorEl, setAnchorEl] = useState(null);
    const [openingOptionMenu, setOpeningOptionMenu] = useState('');

    // For triggering to update data
    const [updateDataCount, doUpdateData] = useState(0);

    const handleClick = (event) => {
        setOpeningOptionMenu(event.currentTarget.id);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setOpeningOptionMenu('');
        setAnchorEl(null);
    };

    const handleClickItemMenu = (e) => {
        handleClose();
        handleRestartCrawler(e.currentTarget.dataset.myValue);
    }

    const handleRestartCrawler = (crawlerName) => {
        let confirm = window.prompt(`Hãy nhập vào ô bên dưới "${crawlerName}" để xác nhận.`)
        if (confirm === crawlerName) {
            adminApi.restartCrawler(crawlerName).then(resp => {
                if (resp?.success)
                    alert(`${crawlerName.toUpperCase()} is restarting...`);
            }).catch(err => {
                if (err?.response?.data?.message)
                    alert(err.response.data.message);
                else
                    alert(err.message);
            });
        }
        else if (confirm !== null && confirm !== crawlerName.toLowerCase())
            alert('Câu lệnh xác nhận chưa đúng.')
    }

    useEffect(() => {
        try {
            if (updateDataCount === 0) {
                adminApi.getCrawlersStatus().then(resp => {
                    if (resp?.success) {
                        const temp = resp.data.sort((a,b) => a.crawler - b.crawler); // Sort by crawler's name
                        let dict = {};
                        for (const status of temp)
                            dict[status.crawler] = status;

                        setData(dict);
                    }
                });
            }
            else if (updateDataCount) {
                // Update dynamic info only, disk info will take lots of time to change => won't get disk info.
                adminApi.getCrawlersStatus({ dataType: 'dynamic', getDiskInfo: false }).then(resp => {
                    if (resp?.success) {
                        let temp = { ...data };
                        for (const status of resp.data) {
                            const crawlerName = status.crawler;
                            temp[crawlerName] = { ...temp[crawlerName], ...status }
                        }
                        setData(temp);
                    }
                });
            }
        } catch (err) {
            console.log(err?.message ?? err);
        } finally {
            setTimeout(() => {
                doUpdateData(updateDataCount + 1);
            }, 4000);
        }

    }, [updateDataCount]); //eslint-disable-line

    const renderCrawlersStatus = () => {
        let result = [];

        for (const crawler in data) {
            const status = data[crawler];

            let diskFreePercentage = 0;
            let diskUsedPercentage = 0;
            let totalDiskGb = 0;
            let usedDiskGb = 0;

            let cpuCount = 1;
            let maxCpuPercent = 0;
            let cpuCrawlerUsagePercent = 0;
            let totalCpuFreePercent = 0;

            let totalMemMb = 0;
            let memCrawlerUsageMb = 0;
            let totalMemUsageMb = 0;
            let totalMemUsagePercent = 0;

            let idBtnCrawlerOptionMenu = `${status.crawler}-btn-menu-options`;

            if (status?.success) {
                // Disk
                diskUsedPercentage = Number(status.diskInfo.usedPercentage)
                diskFreePercentage = Number(100.0) - diskUsedPercentage;
                totalDiskGb = Number(status.diskInfo.totalGb);
                usedDiskGb = Number(status.diskInfo.usedGb);

                // CPU
                cpuCount = Number(status.cpuCount);
                maxCpuPercent = 100 * cpuCount;
                cpuCrawlerUsagePercent = Number(status.pidUsage.cpuTotalUsagePercent);
                totalCpuFreePercent = maxCpuPercent - Number(status.cpuTotalUsagePercent);

                // Memory
                totalMemMb = Number(status.memoryInfo.totalMemMb);
                totalMemUsageMb = Number(status.memoryInfo.usedMemMb)
                memCrawlerUsageMb = Number(status.pidUsage.usedMemMb);
                totalMemUsagePercent = ((totalMemUsageMb - memCrawlerUsageMb) / totalMemMb) * 100;
            }

            result.push(
                <Grid item xs={12} sm={6} lg={4} >
                    <div className={classes.cardContainer}>
                        <Card id={status.crawler} className={"mb-3 " + classes.cardContent} style={{ padding: '1rem' }}>
                            <Grid container>
                                <Grid item xs={11}>
                                    <NoMarginToolTip title='Tên crawler' arrow>
                                        <Typography variant="subtitle1" className="mb-4">
                                            <i class="fa fa-spider mr-2"></i>{status.crawler.toUpperCase()}
                                        </Typography>
                                    </NoMarginToolTip>
                                </Grid>
                                <Grid item xs={1}>
                                    <Tooltip title='Thao tác' arrow>
                                        <IconButton className={classes.actionCrawler}
                                            id={idBtnCrawlerOptionMenu}
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon></MoreVertIcon>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        id={`${status.crawler}-menu-action}`}
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={idBtnCrawlerOptionMenu === openingOptionMenu}
                                        onClose={handleClose}
                                    >
                                        {crawlerOptions.map((option) => (
                                            <MenuItem key={option} data-my-value={status.crawler} onClick={handleClickItemMenu}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Grid>
                            </Grid>
                            <div>
                                <div>
                                    <Tooltip title='Mẫu CPU máy chủ crawler đang sử dụng' placement="right" arrow>
                                        <h6 className="mb-1" style={{ width: 'fit-content' }}>CPU</h6>
                                    </Tooltip>
                                    <p className={classes.fadeText}>{status?.cpuModel ?? '0'}</p>
                                </div>
                                <div className="mb-3">
                                    <Tooltip title='Hiệu năng tối đa CPU bằng số vCPU x 100%' placement="right" arrow>
                                        <h6 className="mb-1" style={{ width: 'fit-content' }}>Mức sử dụng CPU <span className={classes.fadeText}>(Hiệu năng tối đa: {maxCpuPercent}%)</span></h6>
                                    </Tooltip>
                                    <div className="d-flex">
                                        <TinyDonutChart
                                            innerRadius={50}
                                            outerRadius={58}
                                            width={140} height={140}
                                            label={`${status?.cpuTotalUsagePercent ?? '0'}%`}
                                            data={[
                                                { name: 'Crawler sử dụng', value: Math.round(cpuCrawlerUsagePercent / cpuCount) },
                                                { name: 'Các tiến trình khác', value: Math.round((Number(status?.cpuTotalUsagePercent ?? 0) - cpuCrawlerUsagePercent) / cpuCount) },
                                                { name: 'Chưa sử dụng', value: Math.round(totalCpuFreePercent / cpuCount) }
                                            ]}
                                            showTooltip={true}
                                            numericalData={{
                                                'Crawler sử dụng': cpuCrawlerUsagePercent,
                                                'Các tiến trình khác': Number(status?.cpuTotalUsagePercent ?? 0) - cpuCrawlerUsagePercent,
                                                'Chưa sử dụng': totalCpuFreePercent,
                                            }}
                                            displayInTooltipUnit='%'
                                            // wrapperWidth='215px'
                                        />
                                        <div style={{ alignItems: 'center', display: 'flex' }}>
                                            <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
                                                <li><i className="fa fa-circle fa-fw text-primary"></i> Crawler sử dụng</li>
                                                <li><i className="fa fa-circle fa-fw text-info"></i> Các tiến trình khác</li>
                                                <li><i className={"fa fa-circle fa-fw text-gray-300 " + classes.fadeText} style={{ color: 'rgb(186 188 189)' }}></i> Chưa sử dụng</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div>
                                    <div style={{ alignContent: 'end'}}>
                                        <Tooltip title='Mức sử dụng bộ nhớ RAM của máy chủ crawler' placement="right" arrow>
                                            <h6 className="mb-1" style={{ width: 'fit-content' }}>Mức sử dụng RAM <span className={classes.fadeText}>(Tổng dung lượng: {Math.round(totalMemMb/1000)} GB)</span></h6>
                                        </Tooltip>
                                    </div>
                                    {/* <p className={classes.fadeText}>GSkill 2 x 2 GB DDR3 @2400 Mhz</p> */}
                                    <div className="d-flex">
                                        <div style={{ alignItems: 'center', display: 'flex' }}>
                                            <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
                                                <li><i className="fa fa-circle fa-fw text-primary"></i> Crawler sử dụng</li>
                                                <li><i className="fa fa-circle fa-fw text-info"></i> Các tiến trình khác</li>
                                                <li><i className={"fa fa-circle fa-fw text-gray-300 " + classes.fadeText} style={{ color: 'rgb(186 188 189)' }}></i> Chưa sử dụng</li>
                                            </ul>
                                        </div>
                                        <TinyDonutChart
                                            innerRadius={50}
                                            outerRadius={58}
                                            width={140} height={140}
                                            label={`${totalMemUsagePercent.toFixed(2)}%`}
                                            showTooltip={true}
                                            data={[
                                                { name: 'Crawler sử dụng', value: Math.round((memCrawlerUsageMb / totalMemMb) * 100) },
                                                { name: 'Các tiến trình khác', value: Math.round(totalMemUsagePercent) },
                                                { name: 'Chưa sử dụng', value: Math.round(((totalMemMb - totalMemUsageMb) / totalMemMb) * 100) }
                                            ]}
                                            numericalData={{
                                                'Crawler sử dụng': memCrawlerUsageMb/1000,
                                                'Các tiến trình khác': (totalMemUsageMb - memCrawlerUsageMb)/1000,
                                                'Chưa sử dụng': (totalMemMb - totalMemUsageMb)/1000,
                                            }}
                                            displayInTooltipUnit='GB'
                                            // wrapperWidth='130px'
                                        />
                                    </div>
                                </div>
                                <Tooltip title='Dung lượng bộ nhớ trong của máy chủ crawler' placement="right" arrow>
                                    <h6 className="mb-1" style={{ width: 'fit-content' }}>Dung lượng bộ nhớ</h6>
                                </Tooltip>
                                <div className="mb-3 d-flex">
                                    <TinyDonutChart
                                        innerRadius={21}
                                        outerRadius={27}
                                        width={70} height={70}
                                        data={[
                                            { name: 'Đã sử dụng', value: Math.round(diskUsedPercentage) },
                                            { name: 'Còn trống', value: Math.round(diskFreePercentage) },
                                            { name: 'Chưa phân vùng', value: 0 }
                                        ]}
                                        showTooltip={true}
                                        numericalData={{
                                            'Đã sử dụng': usedDiskGb,
                                            'Còn trống':  totalDiskGb - usedDiskGb,
                                            'Chưa phân vùng': 0,
                                        }}
                                        displayInTooltipUnit='GB'
                                        wrapperWidth='170px'
                                    />
                                    <div className="ml-2 align-self-center">
                                        <h2 className="mb-0">{status?.diskInfo?.totalGb ?? '0'} <small>GB</small></h2>
                                        <span className={classes.fadeText}>Tổng dung lượng</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="text-left">
                                        <div className={"small mb-2 " + (classes.fadeText)}>
                                            <i className="fa fa-circle fa-fw text-primary"></i> Đã sử dụng
                                        </div>
                                        <h6 className="mb-0">{usedDiskGb} GB</h6>
                                        <span className={classes.fadeText}>{status?.diskInfo?.usedPercentage ?? '0'}%</span>
                                    </div>
                                    <div className="text-left">
                                        <div className={"small mb-2 " + (classes.fadeText)} >
                                            <i className="fa fa-circle fa-fw text-info"></i> Còn trống
                                        </div>
                                        <h6 className="mb-0">{ (totalDiskGb - usedDiskGb).toFixed(1) } GB</h6>
                                        <span className={classes.fadeText}>{diskFreePercentage}%</span>
                                    </div>
                                    <div className="text-left">
                                        <div className={"small mb-2 " + (classes.fadeText)}>
                                            <i className="fa fa-circle fa-fw text-gray-300"></i> Chưa phân vùng
                                        </div>
                                        <h6 className="mb-0">0 GB</h6>
                                        <span className={classes.fadeText}>0%</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Tooltip title='Mức sử dụng mạng của crawler' placement="right" arrow>
                                    <h6 className="mb-1" style={{ width: 'fit-content' }}>Lưu lượng mạng</h6>
                                </Tooltip>
                                <Grid container>
                                    <Grid item xs={6}>
                                        Download: {status?.netInfo?.ens3?.inputMb ?? '0'} Mb/s
                                    </Grid>
                                    <Grid item xs={6}>
                                        Upload: {status?.netInfo?.ens3?.outputMb ?? '0'} Mb/s
                                    </Grid>
                                </Grid>
                            </div>
                        </Card>
                        <div className={(status?.success ? 'd-none' : classes.backdrop) + ' mb-3'}>
                            <span style={{ textAlign: 'center' }}>Đang kết nối đến Crawler
                                <Typography variant="h6" className="mb-4">
                                    {status.crawler.toUpperCase()}
                                </Typography>
                            </span>
                        </div>
                    </div>
                </Grid>
            )
        }

        return result;
    }

    const renderLoading = () => {
        let result = [];
        for (let i = 0; i < 3; i += 1) {
            result.push(
                <Grid item xs={12} sm={6} lg={4} >
                    <div className={classes.cardContainer}>
                        <Card className="mb-3 " style={{ padding: '1rem' }}>
                            <Skeleton variant='subtitle1'/>
                            <br/>
                            <Skeleton variant='text'/>
                            <Skeleton variant='text'/>
                            <br/>
                            <Skeleton variant='text'/>
                            <Box display="flex" alignItems="center">
                                <Box margin={1}>
                                    <Skeleton variant="circle" width={100} height={100} />
                                </Box>
                                <Box width="100%">
                                    <Skeleton width="100%"><Typography>.</Typography></Skeleton>
                                    <Skeleton width="100%"><Typography>.</Typography></Skeleton>
                                    <Skeleton width="100%"><Typography>.</Typography></Skeleton>
                                </Box>
                            </Box>
                            <br/>
                            <Skeleton variant='text'/>
                            <Skeleton variant='text'/>
                            <br/>
                            <Skeleton variant='text'/>
                            <Box display="flex" alignItems="center">
                                <Box margin={1}>
                                    <Skeleton variant="circle" width={50} height={50} />
                                </Box>
                                <Box width="100%">
                                    <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                                    <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Skeleton width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Skeleton width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Skeleton width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                                <Skeleton className='ml-3' width="30%"><Typography>.</Typography></Skeleton>
                            </Box>
                            <br/>
                            <Skeleton variant='text'/>
                            <Skeleton variant='text'/>
                        </Card>
                    </div>
                </Grid>
            )
        }

        return result;
    }

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Hiệu năng Crawler" subtitle="Quản lý" className="text-sm-left mb-3" />
            </Row>
            <Grid container className={classes.root} spacing={2}>
                {
                    Object.keys(data).length ? renderCrawlersStatus() : renderLoading()
                }
            </Grid>
        </Container>
    )
}