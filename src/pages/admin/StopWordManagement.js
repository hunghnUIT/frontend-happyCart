import React, { useEffect, useState } from 'react';
import { Row, Container } from 'shards-react';
import {
    Chip, Paper, TableBody,
    TableContainer,
    TableRow, TableCell,
    TableHead, CircularProgress,
    Fade, Checkbox,
    FormControlLabel, Button,
    Grid, Typography,
    TextField, 
} from '@material-ui/core';
import { Modal, } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ReplayIcon from '@material-ui/icons/Replay';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PageTitle from '../../components/common/PageTitle';
import EnhancedTableToolbar from './userManagement/EnhancedTableToolbar';
import { capitalizeFirstLetter, isLetter } from '../../helpers/helper';
import adminApi from '../../api/adminApi';


const useStyles = makeStyles((theme) => ({
    accordion: {
        // backgroundColor: 'rgba(0, 0, 0, .05)',
        borderBottom: '1.5px solid rgba(0, 0, 0, .125)',
    },
    selectedChip: {
        textDecoration: 'line-through',
        // color: 'white',
        color: '#f50057',
        // backgroundColor: lighten(theme.palette.secondary.light, 0.5),
    },
    paper: {
        padding: '0 10px',
    },
}));


export default function StopWordManagement() {
    const classes = useStyles();

    // Data
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [listCateId, setListCateId] = useState([]); // This arr category id has exactly order with 'data' arr
    const [expandedList, setExpandedList] = useState([]);

    // Modal
    const [isShowModal, setShowModal] = useState(false);
    const [inputModalData, setInputModalData] = useState({});

    const handleClick = (cateId, name) => {
        const value = `${cateId}-${name}`;
        const selectedIndex = selected.indexOf(value);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, value);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleDeleteStopWord = async () => {
        const len = selected.length;
        if (window.confirm(`Bạn sắp xóa ${len} từ khóa của bộ lọc ra khỏi CSDL. Hãy lưu ý những dữ liệu này sẽ KHÔNG THỂ KHÔI PHỤC. Bạn muốn tiếp tục?`)) {
            const confirmStr = `xóa ${len} từ khóa`;
            let confirm = window.prompt(`Hãy nhập vào ô bên dưới "${confirmStr}" để xác nhận.`)
            if (confirm === confirmStr.toLowerCase()) {
                let succeedId = [];
                let failedId = [];
                let cateNeedUpdate = new Set();

                for (const word of selected) {
                    const splitted = word.split('-');
                    try {
                        const resp = await adminApi.deleteStopWordOfCategory(splitted[0], splitted[1]);
                        if (resp?.status === 200) {
                            succeedId.push(word); 
                            cateNeedUpdate.add(splitted[0]);
                        }
                    } catch (error) {
                        console.log(error.message);
                        failedId.push(word);
                    }
                }

                const failedLen = failedId.length;
                if (failedLen && window.confirm(`Xóa thất bại ${failedLen} từ khóa. Bạn có muốn thử lại?`)) {
                    let countResult = 0;
                    for (const word of failedId) {
                    const splitted = word.split('-');
                    try {
                            const resp = await adminApi.deleteStopWordOfCategory(splitted[0], splitted[1]);
                            if (resp?.status === 200) {
                                succeedId.push(word);
                                cateNeedUpdate.add(splitted[0]);
                                countResult += 1;
                            }
                        } catch (error) {
                            console.log(error.message);
                        }
                    }

                    if (countResult < failedLen)
                        alert(`Không thể xóa ${failedLen - countResult} từ khóa. Hãy thử lại sau.`)
                }
                if (succeedId.length)
                    alert(`Đã xóa xong ${succeedId.length} từ khóa`);

                setSelected([]);
                for (const id of cateNeedUpdate) {
                    getStopWordOfCate(Number(id));
                }
                // doUpdateStopWord(updateStopWord + 1);
            }
            else if (confirm !== null && confirm !== confirmStr.toLowerCase())
                alert('Câu lệnh xác nhận chưa đúng.')
        }
    }

    const getStopWordOfCate = (cateId) => { 
        const index = listCateId.indexOf(cateId);
        adminApi.getAllStopWordsOfCategory(cateId).then(resp => {
            if (resp) {
                const temp = [...data];
                let classify = {};
                for (const word of resp) {
                    const firstChar = word.name.charAt(0);
                    if (isLetter(firstChar)) {
                        classify[firstChar] = classify[firstChar]?.length ?  (classify[firstChar]).concat([word.name]) : [word.name]
                    }
                    else {
                        classify['#'] = classify['#']?.length ?  (classify['#']).concat([word.name]) : [word.name]
                    }
                }
                temp[index].data = classify;

                setData(temp);
            }
        }).catch(err => console.log(err.message));
    }

    const handleSearchCategory = (term) => {
        const result = data.filter(cate => {
            return ((cate?.rootName).toLowerCase()?.includes(term))
        });
        setFilteredData(result);
    }

    const handleSelectCheckbox = (el) => {
        const id = el.target.name;
        const isChecked = el.target.checked;

        // I think below is a dumb way but use object is easier to handle
        const temp = {...inputModalData.selectedCate};
        if (isChecked)
            temp[id] = true;
        else
            delete temp[id];

        setInputModalData({...inputModalData, selectedCate: {...temp}})
    }

    const handleChangeValueInputModal = (el) => {
        let value = el.target.value;
        value = (value.split(',')).map(ele => ele.toLowerCase().replace(/ /g, '_'));
        setInputModalData({
            ...inputModalData,
            stopWords: value,
        })
    }

    const handleClickAddStopWord = async () => {
        if (!inputModalData?.selectedCate || !Object.keys(inputModalData.selectedCate).length)
            return alert('Hãy chọn ít nhất một danh mục');
        if (!inputModalData?.stopWords?.length || !inputModalData?.stopWords?.[0])
            return alert('Mục "Các từ khóa" không được bỏ trống hoặc có ký tự trống')

        let failed = [];
        let count = 0;
        let cateNeedUpdate = new Set();
        for (const cateId in inputModalData.selectedCate) {
            for (const word of inputModalData.stopWords) {
                if (word) {
                    await adminApi.addStopWordForCategory(cateId, word).catch(err => {
                        console.log(err.response.message);
                        failed.push();
                    });

                    count += 1;

                    if (expandedList[listCateId.indexOf(Number(cateId))])
                        cateNeedUpdate.add(cateId);
                }
            }
        }
        let msg = `Thêm thành công ${count} từ khóa.`;
        if (failed?.length)
            msg += ` Thêm thất bại ${failed.length} từ khóa`;

        alert(msg);

        for (const id of cateNeedUpdate) {
            getStopWordOfCate(Number(id));
        }

        if (count) {
            setInputModalData({});
            setShowModal(false);
        }
    };

    const handleHitEnter = (e) => {
        if (e.key === 'Enter' || e.code === "NumpadEnter") 
            handleClickAddStopWord();
    }

    useEffect(() => {
        (async () => {
            const cates = await adminApi.getAllCategoriesStopWord().catch(err => console.log(err.message));
            let tempData = [];
            for (const cate of cates) {
                // const resp = await adminApi.getAllStopWordsOfCategory(cate.id).catch(err => console.log(err.message))
                // if (resp) {
                //     let classify = {};
                //     for (const word of resp) {
                //         const firstChar = word.name.charAt(0);
                //         if (isLetter(firstChar)) {
                //             classify[firstChar] = classify[firstChar]?.length ?  (classify[firstChar]).concat([word.name]) : [word.name]
                //         }
                //         else {
                //             classify['#'] = classify['#']?.length ?  (classify['#']).concat([word.name]) : [word.name]
                //         }
                //     }
                //     tempData.push({
                //         id: cate.id,
                //         rootName: cate.rootName,
                //         data: classify
                //     })
                // }
                tempData.push({
                    id: cate.id,
                    rootName: cate.rootName,
                    data: 'pending'
                })
            }
            setData(tempData);
            setFilteredData(tempData);
            setListCateId(tempData.map(x => x.id));
            setExpandedList(Array(tempData.length).fill(false));
        })()
    }, []);

    const renderData = () => {
        return filteredData.map((cate, idx) => {
            const labelId = `enhanced-table-checkbox-${idx}`;
            const cateIdx = listCateId.indexOf(cate.id);
            return (<TableRow
                hover role="checkbox"
                tabIndex={-1} key={idx}
            >
                <TableCell id={labelId} scope="row" align='center'>
                    {capitalizeFirstLetter(cate.rootName)}
                </TableCell>
                <TableCell>
                    <Accordion 
                        onChange={(event, expanded) => {
                            let t = [...expandedList];
                            t[cateIdx] = expanded;
                            setExpandedList(t);

                            if (expanded && cate.data === 'pending') {
                                setTimeout(() => {
                                    getStopWordOfCate(cate.id)
                                }, 500);
                            }
                        }}
                    >
                        <AccordionSummary className={classes.accordion}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            {expandedList[cateIdx] ? 'Ẩn' : 'Xem'} tất cả từ khóa của danh mục {capitalizeFirstLetter(cate.rootName)}
                        </AccordionSummary>
                            {renderAccordion(cate.id, cate.data)}
                    </Accordion>
                </TableCell>
            </TableRow>
            )
        })
    }

    const renderAccordion = (cateId, chipsData) => {
        let result = [];
        if (chipsData === 'pending') {
            result.push(<AccordionDetails style={{display: 'inline-block'}}>
                    <Fade
                        in={true}
                        style={{
                            transitionDelay: true ? '1000ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </AccordionDetails>)
        }
        else {
            for (const key in chipsData) {
                result.push(<Accordion key={key}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        {key}
                    </AccordionSummary>
                    <AccordionDetails style={{display: 'inline-block'}}>
                        {renderChips(chipsData[key], cateId)}
                    </AccordionDetails>
                </Accordion>)
            }
        }
        return result;
    }

    const renderChips = (data, cateId) => {
        return data.map((el, idx) => {
            const isSelected = selected.indexOf(`${cateId}-${el}`) > -1 ? true : false;
            const style = { margin: '0 5px 5px 0' };
            if (isSelected)
                style.backgroundColor = lighten('#f2528b', 0.5);
            return (
                <Chip style={ style } className={(isSelected ? classes.selectedChip : '')}
                    label={el} key={idx} clickable={false}
                    onDelete={() => {
                        handleClick(cateId, el);
                    }}
                    deleteIcon={
                        isSelected ? <ReplayIcon /> : null
                    }
                />
            )
        })
    }

    const renderSelectModal = () => {
        return data.map(el => {
            return (
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={<Checkbox
                            name={`${el.id}`}
                            checked={inputModalData?.selectedCate?.hasOwnProperty(el.id) || false}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />}
                        onChange={(el) => {handleSelectCheckbox(el)}}
                        label={capitalizeFirstLetter(el.rootName)}
                    />
                </Grid>
            )
        })
    }

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle title="Từ khóa bộ lọc" subtitle="Quản lý" className="text-sm-left mb-3" />
            </Row>
            {/* <Card style={{ minHeight: '400px' }}>
            </Card> */}
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onClickDelete={handleDeleteStopWord} 
                    onChangeUserSearchBar={(value) => {handleSearchCategory(value)}}
                    onClickDeselect={() => {setSelected([])}}
                    tableTitle='Danh sách các từ khóa bộ lọc theo danh mục'
                    unit='từ khóa'
                    searchPlaceHolder='Tìm theo tên danh mục'
                    showDeselectAll={true}
                    showAddButton={true}
                    onClickAddStopWord={() => {setShowModal(true)}}
                />
                <TableContainer>
                    <Table bordered hover={false}
                        // className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <colgroup>
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '85%' }} />
                        </colgroup>
                        <TableHead>
                            <TableCell scope="row" align='center'>Tên danh mục</TableCell>
                            <TableCell>Các từ khóa</TableCell>
                        </TableHead>
                        <TableBody>
                            {renderData()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Modal 
            // dialogClassName={classes.modal} className={classes.modalContainer}
            show={isShowModal}
            onHide={() => { 
                setShowModal(false);
                setInputModalData({});
            }}
            aria-hidden='true'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm từ khóa mới</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-0 pt-0'>
                    <Typography variant='subtitle1'
                        className='pt-2'
                    >
                        Chọn danh mục để thêm từ khóa
                    </Typography>
                    <Grid container>
                        {renderSelectModal()}
                    </Grid>
                    <TextField
                        name="stop-word"
                        variant="outlined"
                        required
                        fullWidth
                        id="affect"
                        label="Các từ khóa"
                        onChange={(el) => { handleChangeValueInputModal(el) }}
                        size="normal"
                        value={inputModalData['stopWords']}
                        helperText='Các từ khóa ngăn cách nhau bởi dấu phẩy ( , ), dấu cách (khoảng trắng) được thay bằng dấu gạch dưới ( _ ).'
                        onKeyDown={handleHitEnter}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClickAddStopWord}>
                        Thêm từ khóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}