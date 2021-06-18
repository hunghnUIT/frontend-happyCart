import React, { createRef, useEffect, useState } from 'react';
import {
    Grid, Toolbar,
    Card, Paper,
    InputBase, IconButton,
    Button, Switch, 
    TextField, FormControlLabel, 
    
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { Row, Container } from 'shards-react';
import { Modal, } from 'react-bootstrap';

import PageTitle from '../../../components/common/PageTitle';
import ListSettingItem from './ListSettingItem';
import adminApi from '../../../api/adminApi';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        padding: '8px 20px 20px 25px',
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
    },
    modalContainer: {
        // backgroundColor: '#cfcfcf',
    }
})


export default function SystemSetting(props) {
    const classes = useStyles();

    // For data
    const [configs, setConfigs] = useState({});
    const [filteredConfigs, setFilteredConfigs] = useState([]);
    const [listEditedInfo, setListEditedInfo] = useState({});

    // For changing to edit mode
    const [isEditMode, setEditMode] = useState(false);

    // For searching
    const [searchTerm, setSearchTerm] = useState('');

    // Update data
    const [updateSystemSetting, setUpdateSystemSetting] = useState(0); // A state just for triggering.

    // For reference
    const [listRef, setListRef] = useState({});

    // For modal
    const [isShowModal, setShowModal] = useState(false);
    const [inputModal, setInputModal] = useState({ type: 'text' });
    const [checked, setChecked] = useState(false);
    
    const handleEditInfo = (id, newInfoObj) => {
        setListEditedInfo({
            ...listEditedInfo,
            [id]: {
                ...listEditedInfo[id],
                ...newInfoObj,
            }
        })
    }

    const handleClickSaveButton = async () => {
        let failedIds = [];
        let successCount = 0;
        for (const key in listEditedInfo) {
            const resp = await adminApi.updateConfig(key, { ...listEditedInfo[key] }).catch(err => {
                console.log(err.message)
                failedIds.push(key);
            });

            if (resp?.success) {
                successCount += 1;
            }
        }

        if (failedIds.length) {
            for (const key of failedIds) {
                const resp = await adminApi.updateConfig(key, { ...listEditedInfo[key] }).catch(err => {
                    console.log(err.message)
                });
    
                if (resp?.success) {
                    successCount += 1;
                }
            }
        }

        // alert
        const failedCount = Object.keys(listEditedInfo) - successCount;
        const msg = `Cập nhật thành công ${successCount} mục. ${failedCount ? `Cập nhật thất bại ${failedCount} mục.` : ''}`;
        alert(msg);

        // reset stuff
        setListEditedInfo({});
        if (successCount)
            setUpdateSystemSetting(updateSystemSetting + 1);
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

    const handleChangeValueInputModal = (key, value) => {
        switch (key) {
            case 'type':
                setChecked(!checked)
                value = value ? 'boolean' : 'text';
                break;
            case 'affect':
                value = (value.split(',')).map(el => el.toLowerCase().trim());
                break;
            default:
                break;
        }

        setInputModal({
            ...inputModal,
            [key]: value,
        })
    }

    const handleCreateSetting = () => {
        if (Object.keys(inputModal).length < 7)
            alert('Tât cả các trường không được bỏ trống.')
        else {
            adminApi.createConfig(inputModal).then(resp => {
                if (resp?.success) {
                    alert('Tạo mới thành công');
                    setShowModal(false);
                    setUpdateSystemSetting(1); // Trigger reload this page
                }
            }).catch(err => {
                if (err.response.status > 500)
                    alert('Tạo mới cài đặt thất bại. Hãy thử lại.')
                else 
                    alert(err.message);
            }); 
        }
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
    }, [updateSystemSetting])

    const renderListSettingItem = () => {
        let result = [];
        let index = 0;
        for (const key in filteredConfigs) {
            result.push(<ListSettingItem 
                key={index} isEditMode={isEditMode}
                category={key} refer={listRef[key]} 
                listSettingItem={filteredConfigs[key]} noMarginTop={index === 0 ? true : false}
                onInfoChange={(id, infoObj) => {handleEditInfo(id, infoObj)}}
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
                            <Button onClick={handleClickSaveButton}>
                                <SaveIcon className='mr-1'/> Lưu {isEditMode ? 'thay đổi' : 'cài đặt'}
                            </Button>
                            <br/>
                            <Button onClick={() => {setEditMode(!isEditMode)}}>
                                <EditIcon className='mr-1'/> Thay đổi {isEditMode ? 'cài đặt' : 'mô tả'}
                            </Button>
                            <br/>
                            <Button onClick={() => {setShowModal(!isEditMode)}}>
                                <AddIcon className='mr-1'/> Thêm cài đặt mới
                            </Button>
                        </div>
                    </Grid>
                    <Grid item sm={11} lg={10} className={classes.settingItemSide}>
                        { renderListSettingItem() }
                    </Grid>
                </Grid>
            </Card>
            <Modal dialogClassName={classes.modal} className={classes.modalContainer}
                show={isShowModal}
                onHide={() => {setShowModal(false)}}
                aria-hidden='true'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm cài đặt mới</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-0'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Tên của cài đặt"
                                autoFocus
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal" 
                                value={inputModal['name']}
                                helperText='Được viết theo dạng snake_case và bằng tiếng Anh.'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Tiêu đề"
                                autoFocus
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal" 
                                value={inputModal['title']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                variant="outlined"
                                required
                                fullWidth
                                id="description"
                                label="Mô tả"
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal"
                                value={inputModal['description']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="value"
                                variant="outlined"
                                required
                                fullWidth
                                id="value"
                                label="Giá trị"
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal"
                                value={inputModal['value']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="affect"
                                variant="outlined"
                                required
                                fullWidth
                                id="affect"
                                label="Đối tượng ảnh hưởng đến"
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal"
                                value={inputModal['affect']}
                                helperText='Các đối tượng ngăn cách nhau bởi dấu phẩy ( , )'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="category"
                                variant="outlined"
                                required
                                fullWidth
                                id="category"
                                label="Danh mục"
                                onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.value)}}
                                size="normal"
                                value={inputModal['category']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch 
                                    name='type'
                                    checked={checked} 
                                    onChange={(el) => {handleChangeValueInputModal(el.target.name, el.target.checked)}}
                                />}
                                label={`Kiểu dữ liệu Boolean ${checked ? '' : '(Mặc định là kiểu chữ/số)'}`}
                            />
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${classes.updateButton} ${classes.buttonFooter}`} 
                        onClick={handleCreateSetting}
                    >
                        Thêm cài đặt
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}