import React, { useEffect, useState } from 'react';
import {
    TableContainer, Table,
    makeStyles, TableBody,
    TableRow, TableCell,
    Checkbox,
} from '@material-ui/core';
import EnhancedTableHead from '../userManagement/EnhancedTableHead';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
    },
}));

const headCells = [
    { id: 'title', alignCenter: false, disablePadding: true, label: 'Tiêu đề' },
    { id: 'name', alignCenter: false, disablePadding: false, label: 'Tên cấu hình' },
    { id: 'createdAt', alignCenter: false, disablePadding: false, label: 'Đối tượng ảnh hưởng' },
];

export default function DeleteSettingItemView(props) {
    const classes = useStyles();

    const [list, setList] = useState([]);
    const [selected, setSelected] = useState([]);

    // For sorting
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const handleClick = (event, _id) => {
        const selectedIndex = selected.indexOf(_id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, _id);
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
        props.onSelectSetting(newSelected);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = list.map((n) => n._id);
            setSelected(newSelecteds);
            props.onSelectSetting(newSelecteds);
            return;
        }
        setSelected([]);
        props.onSelectSetting([]);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const isSelected = (_id) => selected.indexOf(_id) !== -1;

    useEffect(() => {
        // Dumb way, again.
        let arr = [];

        for (const key in props.listSettingItem) {
            for (const sub in props.listSettingItem[key])
                arr = arr.concat(props.listSettingItem[key][sub])
        }

        setList(arr);
        props.onSelectSetting([]);
    }, [props.listSettingItem]) // eslint-disable-line

    useEffect(() => {
        setSelected([]);
    }, [props.resetSelected])

    return (
        <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={list.length}
                    headCells={headCells}
                />
                <TableBody>
                    {
                        stableSort(list, getComparator(order, orderBy))
                        .map((row, index) => {
                            const isItemSelected = isSelected(row._id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row._id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row._id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                        {row.title}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{(row.affect).join(',')}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}