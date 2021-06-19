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
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/styles';
import { Row, Container } from 'shards-react';
import { Modal, } from 'react-bootstrap';

import PageTitle from '../../../components/common/PageTitle';
import ListSettingItem from './ListSettingItem';
import DeleteSettingItemView from './DeleteSettingItemView';
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
    // For changing to delete item mode
    const [isDeleteMode, setDeleteMode] = useState(false);

    // For searching
    const [searchTerm, setSearchTerm] = useState('');

    // Update data
    const [updateSystemSetting, doUpdateSystemSetting] = useState(0); // A state just for triggering.

    // For reference
    const [listRef, setListRef] = useState({});

    // For modal
    const [isShowModal, setShowModal] = useState(false);
    const [inputModal, setInputModal] = useState({ type: 'text' });
    const [checked, setChecked] = useState(false);

    // For selecting configs
    const [selected, setSelected] = useState([]);
    // For trigger updating deleting setting item view.
    const [resetSelectedDeletingSettingView, doResetSelectedDeletingSettingView] = useState('');

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
            doUpdateSystemSetting(updateSystemSetting + 1);
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
                    setInputModal({ type: 'text' });
                    setShowModal(false);
                    doUpdateSystemSetting(updateSystemSetting + 1); // Trigger reload this page
                }
            }).catch(err => {
                if (err.response.status > 500)
                    alert('Tạo mới cài đặt thất bại. Hãy thử lại.')
                else
                    alert(err.message);
            });
        }
    }

    const handleDeleteConfig = async () => {
        const len = selected.length;
        if (!len)
            alert('Bạn chưa chọn mục để xóa'); 
        else if (len && window.confirm(`Bạn sắp xóa ${len} cài đặt ra khỏi CSDL. Hãy lưu ý những dữ liệu này sẽ KHÔNG THỂ KHÔI PHỤC. Bạn muốn tiếp tục?`)) {
            const confirmStr = `xóa ${len} cài đặt`;
            let confirm = window.prompt(`Hãy nhập vào ô bên dưới "${confirmStr}" để xác nhận.`)
            if (confirm === confirmStr.toLowerCase()) {
                let succeedId = [];
                let failedId = [];
                for (const id of selected) {
                    try {
                        const resp = await adminApi.deleteConfig(id);
                        if (resp.success)
                            succeedId.push(id);
                    } catch (error) {
                        console.log(error.message);
                        failedId.push(id);
                    }
                }

                const failedLen = failedId.length;
                if (failedLen && window.confirm(`Xóa thất bại ${failedLen} cài đặt. Bạn có muốn thử lại?`)) {
                    let countResult = 0;
                    for (const id of failedId) {
                        try {
                            const resp = await adminApi.deleteConfig(id);
                            if (resp?.success) {
                                succeedId.push(id);
                                countResult += 1;
                            }
                        } catch (error) {
                            console.log(error.message);
                        }
                    }

                    if (countResult < failedLen)
                        alert(`Không thể xóa ${failedLen - countResult} cài đặt. Hãy thử lại sau.`)
                }
                if (succeedId.length)
                    alert(`Đã xóa xong ${succeedId.length} cài đặt`);

                setSelected([]);
                doUpdateSystemSetting(updateSystemSetting + 1);

                // Dumb way, but I'm too lazy to make it better. Easiest way is move this handleDeleteConfig function to child.
                doResetSelectedDeletingSettingView(resetSelectedDeletingSettingView + 1);
            }
            else if (confirm !== null && confirm !== confirmStr.toLowerCase())
                alert('Câu lệnh xác nhận chưa đúng.')
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

    const renderContentListSettingItem = () => {
        let result = [];
        let index = 0;
        if (!isDeleteMode) {
            for (const key in filteredConfigs) {
                result.push(<ListSettingItem
                    key={index} isEditMode={isEditMode}
                    category={key} refer={listRef[key]}
                    listSettingItem={filteredConfigs[key]} noMarginTop={index === 0 ? true : false}
                    onInfoChange={(id, infoObj) => { handleEditInfo(id, infoObj) }}
                />)

                index += 1;
            }
        }
        else
            result.push(
            <DeleteSettingItemView
                listSettingItem={filteredConfigs}
                onSelectSetting={(list) => {
                    console.log(list)
                    setSelected(list); 
                }}
                resetSelected={resetSelectedDeletingSettingView}
            />)
        return result;
    }

    const renderNavSideMenu = () => {
        return Object.keys(filteredConfigs).map((key, idx) => <li key={idx}><a className={classes.navLink} ref={listRef[key]} onClick={() => { listRef[key].current.scrollIntoView() }}>{key}</a></li>); //eslint-disable-line
    }

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Hệ thống HappyCart" subtitle="Tổng quan" className="text-sm-left mb-3" />
            </Row>
            <Card style={{ minHeight: '400px' }}>
                <Toolbar>
                    <Paper className={classes.searchBarPaper}>
                        <InputBase
                            className={classes.searchBar}
                            placeholder="Tìm theo tên, mô tả của cài đặt"
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
                    <Grid item sm={1} lg={2} style={{ display: 'block' }}>
                        <div className={classes.menuSide}>
                            <ul className={classes.listNavLink}>
                                {renderNavSideMenu()}
                            </ul>
                            <hr />
                            {/* Show when edit mode is ON */}
                            <Button className={isEditMode ? 'pl-0' : 'd-none'} 
                                onClick={() => { 
                                    setListEditedInfo({});
                                    setEditMode(!isEditMode); 
                                }}
                            >
                                <KeyboardBackspaceIcon className='mr-1' /> Trở lại
                            </Button>
                            <br className={isEditMode ? '' : 'd-none'} />

                            {/* Hide when delete mode is ON */}
                            <Button onClick={handleClickSaveButton} className={isDeleteMode ? 'd-none' : 'pl-0'} disabled={Object.keys(listEditedInfo).length ? false : true}>
                                <SaveIcon className='mr-1' /> Lưu thay đổi
                            </Button>
                            <br className={isDeleteMode ? 'd-none' : ''} />

                            {/* Hide when delete mode or edit mode (make room for above back button) is ON */}
                            <Button className={isDeleteMode || isEditMode ? 'd-none' : 'pl-0'}
                                onClick={() => { 
                                    setListEditedInfo({});
                                    setEditMode(!isEditMode); 
                                }}
                            >
                                <EditIcon className='mr-1' /> Thay đổi mô tả'
                            </Button>
                            <br className={isDeleteMode || isEditMode ? 'd-none' : ''} />

                            {/* Hide when delete mode is ON */}
                            <Button onClick={() => { setShowModal(!isShowModal) }} className={isDeleteMode ? 'd-none' : 'pl-0'}>
                                <AddIcon className='mr-1' /> Thêm cấu hình mới
                            </Button>
                            <br className={isDeleteMode ? 'd-none' : ''} />

                            {/* Hide when edit mode is ON */}
                            <Button onClick={() => { setDeleteMode(!isDeleteMode) }} className={isEditMode ? 'd-none' : 'pl-0'}>
                                {
                                    !isDeleteMode ?
                                        <><DeleteIcon className='mr-1' /> Xóa cấu hình</>
                                        : <><KeyboardBackspaceIcon className='mr-1' /> Trở lại</>
                                }
                            </Button>
                            <br />

                            {/* Show when delete mode is ON */}
                            <Button onClick={handleDeleteConfig} className={isDeleteMode ? 'pl-0' : 'd-none'} disabled={selected.length ? false : true}>
                                <DeleteIcon className='mr-1' /> Xóa { selected.length ? selected.length : '' } mục đã chọn
                            </Button>
                        </div>
                    </Grid>
                    <Grid item sm={11} lg={10} className={classes.settingItemSide}>
                        {renderContentListSettingItem()}
                    </Grid>
                </Grid>
            </Card>
            <Modal dialogClassName={classes.modal} className={classes.modalContainer}
                show={isShowModal}
                onHide={() => { setShowModal(false) }}
                aria-hidden='true'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm cấu hình mới</Modal.Title>
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
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
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
                                size="normal"
                                value={inputModal['category']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch
                                    name='type'
                                    checked={checked}
                                    onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.checked) }}
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
                        Thêm cấu hình
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}