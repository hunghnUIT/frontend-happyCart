import React from 'react';
import {
    Grid,
    Card,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Row, Container } from 'shards-react';

import PageTitle from '../../../components/common/PageTitle';
import ListSettingItem from './ListSettingItem';

const useStyles = makeStyles({
    menuSide: {
        position: "fixed",
        padding: '20px',
        display: 'block',
    },
    settingItemSide: {
        padding: '20px'
    },
    listNavLink: {
        listStyleType: 'none',
        paddingLeft: 0,
    },
    navLink: {
        color: 'black',
        textDecoration: 'none !important',
    }
})

const demoTitle = 'Khoảng thời gian giữa các lần crawl';
const demoDescription = 'Thời gian giữa các lần crawler bắt đầu lần crawl mới của chúng. Đơn vị: GIỜ. Thời gian giữa các lần crawler bắt đầu lần crawl mới của chúng. Đơn vị: GIỜ. Thời gian giữa các lần crawler bắt đầu lần crawl mới của chúng. Đơn vị: GIỜ';

const demoCategory1 = [{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'boolean',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},]

const demoCategory2 = [{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'boolean',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},]

const demoCategory3 = [{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'boolean',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},{
    name: 'time_between_crawl',
    title: demoTitle,
    description: demoDescription,
    type: 'text',
},]

export default function SystemSetting(props) {
    const classes = useStyles();
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Hệ thống HappyCart" subtitle="Tổng quan" className="text-sm-left mb-3" />
            </Row>
            <Card>
                <Grid container>
                    <Grid item sm={1} lg={2} style={{display: 'block'}}>
                        <div className={classes.menuSide}>
                            <ul className={classes.listNavLink}>
                                <li><a className={classes.navLink} href='#first'>First Side</a></li>
                                <li><a className={classes.navLink} href='#second'>Second Side</a></li>
                                <li><a className={classes.navLink} href='#third'>Third Side</a></li>
                            </ul>
                        </div>
                    </Grid>
                    <Grid item sm={11} lg={10} className={classes.settingItemSide}>
                        <ListSettingItem category='First' categoryId='first' listSettingItem={demoCategory1}/>
                        <ListSettingItem category='Second' categoryId='second' listSettingItem={demoCategory2}/>
                        <ListSettingItem category='Third' categoryId='third' listSettingItem={demoCategory3}/>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}