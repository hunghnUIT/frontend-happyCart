import React, { createRef, useEffect, useState } from 'react';
import {
    Grid, Toolbar,
    Card, Paper,
    InputBase, IconButton,
    Button, Switch,
    TextField, FormControlLabel,
    Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Row, Container } from 'shards-react';
import { Modal, } from 'react-bootstrap';
import { TreeItem, TreeView } from '@material-ui/lab';

import PageTitle from '../../../components/common/PageTitle';
import ListSettingItem from './ListSettingItem';
import DeleteSettingItemView from './DeleteSettingItemView';
import adminApi from '../../../api/adminApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { generateSlug, limitDisplayString, sortObjectByKey } from '../../../helpers/helper';

const useStyles = makeStyles({
    searchBarPaper: {
        width: '100%',
    },
    searchBar: {
        width: '95%',
        paddingLeft: '10px',
    },
    menuSide: {
        position: 'fixed',
        // top: '80px',
        padding: '8px 20px 20px 25px',
        // display: 'block',
    },
    highlightMenu: {
        marginRight: '2px',
        color: '#0070ba !important',
        // border: '1px solid #007bff',
    },
    highlightMenuContent: {
        color: '#0070ba !important',
    },
    settingItemSide: {
        padding: '5px 20px 20px 3rem',
    },
    listNavLink: {
        listStyleType: 'none',
        paddingLeft: 0,
    },
    navLink: {
        color: 'black',
        textDecoration: 'none !important',
        margin: '5px 0',
        padding: '5px'
    },
    modalContainer: {
        // backgroundColor: '#cfcfcf',
    }
})

const NoMarginToolTip = withStyles({
    tooltip: {
        margin: 0,
    }
})(Tooltip);

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
    const [listRefOffset, setListRefOffset] = useState([]);
    const [categoryTree, setCategoryTree] = useState({});

    // For menu nav side
    const [expandedList, setExpandedList] = useState(['0']);

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

    const handleSearchConfig = (term, data = {}) => {
        let dataToFilter = {};
        if (Object.keys(data).length)
            dataToFilter = data;
        else
            dataToFilter = configs;
        if (term) {
            term = term.toLowerCase();
            let result = {}
            for (const key in dataToFilter) {
                result[key] = {};
                for (const subCate in dataToFilter[key]) {
                    const temp = dataToFilter[key][subCate].filter((config, idx) => {
                        return (((config?.title ?? '').toLowerCase())?.includes(term) || ((config?.description ?? '').toLowerCase()).includes(term));
                    });
                    result[key][subCate] = temp;
                }
            }

            for (const key in result) {
                for (const subCate in result[key]) {
                    if (!result[key][subCate]?.length) {
                        delete result[key][subCate];
                    }
                }
                if (!Object.keys(result[key]).length)
                    delete result[key];
            }

            setFilteredConfigs(result);
        }
        else
            setFilteredConfigs(dataToFilter);
    }

    const handleChangeValueInputModal = (key, value) => {
        switch (key) {
            case 'type':
                setChecked(!checked)
                value = value ? 'boolean' : 'text';
                break;
            case 'affect':
                value = (value.split(',')).map(el => el.replace(/\s/g, '_'));
                break;
            case 'name':
                value = value.replace(/\s/g, '_').toLowerCase();
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
                    alert('Tạo mới cấu hình thất bại. Hãy thử lại.')
                else
                    alert(err.message);
            });
        }
    }

    const handleDeleteConfig = async () => {
        const len = selected.length;
        if (!len)
            alert('Bạn chưa chọn mục để xóa'); 
        else if (len && window.confirm(`Bạn sắp xóa ${len} cấu hình ra khỏi CSDL. Hãy lưu ý những dữ liệu này sẽ KHÔNG THỂ KHÔI PHỤC. Bạn muốn tiếp tục?`)) {
            const confirmStr = `xóa ${len} cấu hình`;
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
                if (failedLen && window.confirm(`Xóa thất bại ${failedLen} cấu hình. Bạn có muốn thử lại?`)) {
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
                        alert(`Không thể xóa ${failedLen - countResult} cấu hình. Hãy thử lại sau.`)
                }
                if (succeedId.length)
                    alert(`Đã xóa xong ${succeedId.length} cấu hình`);

                setSelected([]);
                doUpdateSystemSetting(updateSystemSetting + 1);

                // Dumb way, but I'm too lazy to make it better. Easiest way is move this handleDeleteConfig function to child.
                doResetSelectedDeletingSettingView(resetSelectedDeletingSettingView + 1);
            }
            else if (confirm !== null && confirm !== confirmStr.toLowerCase())
                alert('Câu lệnh xác nhận chưa đúng.')
        }
    }

    const handleClickShowTreeItem = (nodeId) => {
        const selectedIndex = expandedList.indexOf(nodeId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(expandedList, nodeId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(expandedList.slice(1));
        } else if (selectedIndex === expandedList.length - 1) {
            newSelected = newSelected.concat(expandedList.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                expandedList.slice(0, selectedIndex),
                expandedList.slice(selectedIndex + 1),
            );
        }

        setExpandedList(newSelected);
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

                let temp = {...dict};
                for (const key in dict) {
                    dict[key] = {};
                }
                for (const key in temp) {
                    for (const item of temp[key]) {
                        if (!dict[key]?.[item.subCategory]) {
                            dict[key][item.subCategory] = [item];
                        }
                        else {
                            dict[key][item.subCategory].push(item);
                        }
                    }
                }

                dict = { ...sortObjectByKey(dict) }
                for (const key in dict) {
                    dict[key] = { ...sortObjectByKey(dict[key]) }
                }
                setConfigs(dict);
                setFilteredConfigs(dict);

                // state "refs" is holding refs of category, now create refs for subCate
                let categoryTree = {};
                // Keys of "refs" is the same to keys of "dict"
                for (const key in dict) {
                    const subCates = Object.keys(dict[key]);
                    for (const subCate of subCates) {
                        if (!categoryTree[key]) {
                            categoryTree[key] = [subCate];
                        }
                        else
                            categoryTree[key].push(subCate);

                        refs[`${key}:${subCate}`]=createRef();
                    }
                }
                setListRef(refs);
                setCategoryTree(categoryTree);

                let listOffset = [];
                let listOffsetSubCate = [];
                for (const key in categoryTree) {
                    const offset = document.querySelector(`#${generateSlug(key)}`).offsetTop;
                    listOffset.push({
                        offset: offset,
                        isOnScreen: false,
                    });

                    for (const sub of categoryTree[key]) {
                        const subOffset = document.querySelector(`#${generateSlug(`${key}:${sub}`)}`).offsetTop;
                        listOffsetSubCate.push({
                            offset: subOffset,
                            isOnScreen: false,
                        })
                    }
                }
                listOffset[0].isOnScreen = true;
                listOffsetSubCate[0].isOnScreen = true;
                setListRefOffset(listOffsetSubCate);

                const menuSide = document.querySelector('#divMenuSide');
                const menuSideOffset = menuSide.offsetTop;

                window.onscroll = () => {
                    // scroll to where, trigger event to that place.
                    const pOffset = window.pageYOffset;
                    // console.log(pOffset, menuSideOffset);
                    
                    if (pOffset-100 < menuSideOffset) {
                        // menuSide.style.removeProperty('position');
                        if (menuSide.style.top)
                            menuSide.style.removeProperty('top');
                        // menuSide.classList.remove('menuSide');
                    }
                    else if (pOffset+50 >= menuSideOffset) {
                        if (!menuSide.style.top) {
                            // menuSide.style.position = 'fixed';
                            menuSide.style.top = '80px';
                        }
                    }
                    

                    // Dumb way below, again and twice. :(( (foreach loop is suck)
                    let tempCate = [].concat(listOffset);
                    let latestIdx = null;
                    listOffset.forEach((el, idx) => {
                        tempCate[idx].isOnScreen = false;

                        if (el.offset <= pOffset + listOffset[0].offset + 10) { // 10 is optional, remove to know how different
                            latestIdx = idx;
                        }
                    });
                    if (latestIdx || latestIdx === 0) {
                        tempCate[latestIdx].isOnScreen = true;
                        setExpandedList([latestIdx.toString()]);
                    }

                    let tempSubCate = [].concat(listOffsetSubCate)
                    let subLatestIdx = null;
                    const difference = listOffsetSubCate[0].offset - listOffset[0].offset;
                    listOffsetSubCate.forEach((el, idx) => {
                        tempSubCate[idx].isOnScreen = false;

                        // + difference means: When cate is show, first subCate of that cate will be selected
                        if (el.offset <= pOffset + listOffsetSubCate[0].offset + difference) {
                            subLatestIdx = idx;
                        }
                    });
                    if (subLatestIdx || subLatestIdx === 0)
                        tempSubCate[subLatestIdx].isOnScreen = true;
                    setListRefOffset(tempSubCate);
                }

                // Dumb way again
                if (searchTerm)
                    handleSearchConfig(searchTerm, dict);
            }
        })
    }, [updateSystemSetting]) // eslint-disable-line

    useEffect(() => {
        let categoryTree = {};
        for (const key in filteredConfigs) {
            const subCates = Object.keys(filteredConfigs[key]);
            for (const subCate of subCates) {
                if (!categoryTree[key]) {
                    categoryTree[key] = [subCate];
                }
                else
                    categoryTree[key].push(subCate);
            }
        }
        setCategoryTree(categoryTree);
    }, [filteredConfigs])

    const renderListSettingItem = () => {
        let result = [];
        let idx = 0;
        for (const cate in filteredConfigs) {
            result.push(
                <ListSettingItem
                    id={cate}
                    key={idx*2} isSubCate={false}
                    category={cate} refer={listRef[cate]}
                    noMarginTop={idx === 0 ? true : false}
                >
                    {renderContentListSettingItem(cate)}
                </ListSettingItem>
            )
            idx += 1; 
        }
        return result;
    }

    const renderContentListSettingItem = (cate) => {
        let result = [];
        let index = 0;

        for (const key in filteredConfigs[cate]) {
            const id = `${cate}:${key}`;
            result.push(<ListSettingItem
                id={id}
                key={index} isSubCate={true} isEditMode={isEditMode}
                subCategory={key} refer={listRef[id]}
                listSettingItem={filteredConfigs[cate][key]} noMarginTop={index === 0 ? true : false}
                onInfoChange={(id, infoObj) => { handleEditInfo(id, infoObj) }}
            />)

            index += 1;
        }
        return result;
    }

    const renderNavSideMenu = () => {
        let lastIndex= 0;
        if (!isDeleteMode && Object.keys(categoryTree)?.length) {
            return Object.keys(categoryTree).map((key, idx) => {
                const subCateLength = categoryTree[key]?.length || 0;
                let treeItem = (
                    <TreeItem
                        key={idx} nodeId={idx.toString()} label={limitDisplayString(key)}
                        onLabelClick={() => { listRef[key].current.scrollIntoView() }}
                        onIconClick={() => {handleClickShowTreeItem(idx.toString())}}
                    >
                        {
                            subCateLength ?
                            categoryTree[key].map((sub, i) => (
                                // Below is a little trick to get index of array offset
                                <NoMarginToolTip title={sub} placement="left" arrow>
                                    <TreeItem className={listRefOffset[lastIndex+i]?.isOnScreen ? classes.highlightMenuContent : ''}
                                        onClick={() => { listRef[`${key}:${sub}`].current.scrollIntoView() }}
                                        key={lastIndex+i} nodeId={`${key}_${i}`} label={limitDisplayString(sub, 15)} disabled={true}>
                                    </TreeItem>
                                </NoMarginToolTip>
                            )) : null
                        }
                    </TreeItem>
                )
                lastIndex += subCateLength;
                return treeItem;
            })
        }
        else
            return null;
    }

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Cấu hình Crawler" subtitle="Quản lý" className="text-sm-left mb-3" />
            </Row>
            <Card style={{ minHeight: '400px' }}>
                <Toolbar>
                    <Paper className={classes.searchBarPaper}>
                        <InputBase
                            className={classes.searchBar}
                            placeholder="Tìm theo tên, mô tả của cấu hình"
                            inputProps={{ 'aria-label': 'tìm kiếm cấu hình' }}
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
                    <Grid item sm={3} lg={2} style={{ display: 'block' }}>
                        <div className={classes.menuSide} id='divMenuSide'>
                            <TreeView
                                className={classes.root}
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                expanded={expandedList}
                                defaultExpandIcon={<ChevronRightIcon />}
                                disableSelection={true}
                            >
                                {renderNavSideMenu()}
                            </TreeView>
                            <hr style={{marginRight: '20px'}} className={!isDeleteMode ? '' : 'd-none'}/>
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
                    <Grid item sm={9} lg={10} className={classes.settingItemSide}>
                        {
                            !isDeleteMode ? renderListSettingItem() : 
                                <DeleteSettingItemView
                                    listSettingItem={filteredConfigs}
                                    onSelectSetting={(list) => {
                                        console.log(list)
                                        setSelected(list); 
                                    }}
                                    resetSelected={resetSelectedDeletingSettingView}
                                />
                        }
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
                                label="Tên của cấu hình"
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
                            <TextField
                                name="subCategory"
                                variant="outlined"
                                required
                                fullWidth
                                id="subCategory"
                                label="Danh mục con"
                                onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.value) }}
                                size="normal"
                                value={inputModal['subCategory']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch
                                    name='type'
                                    checked={checked}
                                    onChange={(el) => { handleChangeValueInputModal(el.target.name, el.target.checked) }}
                                    color="primary"
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