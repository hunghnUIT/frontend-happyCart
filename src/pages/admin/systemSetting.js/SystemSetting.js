import React, { createRef, useEffect, useState } from 'react';
import {
    Grid, Toolbar,
    Card, Paper,
    InputBase, IconButton,
    Button,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { Row, Container } from 'shards-react';

import PageTitle from '../../../components/common/PageTitle';
import ListSettingItem from './ListSettingItem';
import adminApi from '../../../api/adminApi';

const useStyles = makeStyles({
    searchBarPaper: {
        width: '100%',
    },
    searchBar: {
        width: '95%',
        paddingLeft: '10px',
    },
    menuSide: {
        position: "fixed",
        padding: '5px 20px 20px 25px',
        display: 'block',
    },
    settingItemSide: {
        padding: '5px 20px 20px 25px',
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


export default function SystemSetting(props) {
    const classes = useStyles();

    // For data
    const [configs, setConfigs] = useState({});
    const [filteredConfigs, setFilteredConfigs] = useState([]);
    const [listEdited, setListEdited] = useState({});

    // For searching
    const [searchTerm, setSearchTerm] = useState('');

    // Update data
    const [updateConfig, setUpdateConfig] = useState(0); // A state just for triggering.

    // For reference
    const [listRef, setListRef] = useState({});

    const handleEditValue = (id, newValue) => {
        setListEdited({
            ...listEdited,
            [id]: newValue,
        })        
    }

    const handleUpdateValue = async () => {
        let failedIds = [];
        let successCount = 0;
        for (const key in listEdited) {
            const resp = await adminApi.updateConfig(key, { value: listEdited[key] }).catch(err => {
                console.log(err.message)
                failedIds.push(key);
            });

            if (resp?.success) {
                successCount += 1;
            }
        }

        if (failedIds.length) {
            for (const key of failedIds) {
                const resp = await adminApi.updateConfig(key, { value: listEdited[key] }).catch(err => {
                    console.log(err.message)
                });
    
                if (resp?.success) {
                    successCount += 1;
                }
            }
        }

        // alert
        const failedCount = Object.keys(listEdited) - successCount;
        const msg = `Cập nhật thành công ${successCount} mục. ${failedCount ? `Cập nhật thất bại ${failedCount} mục.` : ''}`;
        alert(msg);

        // reset stuff
        setListEdited({});
        if (failedCount)
            setUpdateConfig(updateConfig + 1);
    }

    const handleSearchConfig = (term) => {
        if (term) {
            let result = {}
            for (const key in configs) {
                // eslint-disable-next-line
                const temp = configs[key].filter((config, idx) => {
                    // const title = (config?.title || '').toLowerCase();
                    // const description = (config?.description || '').toLowerCase();
                if ((config?.title.toLowerCase())?.includes(term) || (config?.description.toLowerCase()).includes(term))
                    return config;
                });
                result[key] = temp;
            }
    
            for (const key in result) {
                if (!result[key].length)
                    delete result[key];
            }
    
            setFilteredConfigs(result);
        }
        else 
            setFilteredConfigs(configs);
    }

    useEffect(() => {
        adminApi.getConfigs().then(resp => {
            if (resp.success) {
                let dict = {};
                let refs = {};
                for (const config of resp.data) {
                    if (!dict[config.category]) {
                        dict[config.category] = [config];
                        refs[config.category] = createRef();
                    }
                    else {
                        dict[config.category].push(config);
                    }
                }

                setConfigs(dict);
                setFilteredConfigs(dict);
                setListRef(refs);
            }
        })
    }, [updateConfig])

    const renderListSettingItem = () => {
        let result = [];
        let index = 0;
        for (const key in filteredConfigs) {
            if (index === 0)
                result.push(<ListSettingItem 
                    key={index}
                    category={key} refer={listRef[key]} 
                    listSettingItem={filteredConfigs[key]} noMarginTop={true}
                    onValueChange={(id, newValue) => {handleEditValue(id, newValue)}}
                />)
            else
                result.push(<ListSettingItem 
                    key={index}
                    category={key} refer={listRef[key]} 
                    listSettingItem={filteredConfigs[key]}
                    onValueChange={(id, newValue) => {handleEditValue(id, newValue)}}
                />)

            index += 1;
        }
        return result;
    }

    const renderNavSideMenu = () => {
        return Object.keys(filteredConfigs).map((key, idx) => <li key={idx}><a className={classes.navLink} ref={listRef[key]} onClick={() => {listRef[key].current.scrollIntoView()}}>{key}</a></li>); //eslint-disable-line
    }

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Hệ thống HappyCart" subtitle="Tổng quan" className="text-sm-left mb-3" />
            </Row>
            <Card style={{minHeight: '400px'}}>
                <Toolbar>
                    <Paper className={classes.searchBarPaper}>
                        <InputBase
                            className={classes.searchBar}
                            placeholder="Tìm theo tên, mô tả cài đặt"
                            inputProps={{ 'aria-label': 'tìm kiếm cài đặt' }}
                            onChange={async (e) => {
                                const term = e.target.value;
                                await setSearchTerm(term);
                                handleSearchConfig(term);
                            }}
                            value={searchTerm}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Toolbar>
                <Grid container>
                    <Grid item sm={1} lg={2} style={{display: 'block'}}>
                        <div className={classes.menuSide}>
                            <ul className={classes.listNavLink}>
                                { renderNavSideMenu() }
                            </ul>
                            <hr/>
                            <Button onClick={handleUpdateValue}>
                                <SaveIcon className='mr-1'/> Save Settings
                            </Button>
                            <br/>
                            <Button>
                                <EditIcon className='mr-1'/> Edit Settings
                            </Button>
                        </div>
                    </Grid>
                    <Grid item sm={11} lg={10} className={classes.settingItemSide}>
                        { renderListSettingItem() }
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}