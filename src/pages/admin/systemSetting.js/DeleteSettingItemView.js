import React, { useEffect, useState } from 'react';
import {
    TableContainer, Table,
    makeStyles, TableBody,
    TableRow, TableCell,
    Checkbox,
} from '@material-ui/core';


const useStyles = makeStyles({
    root: {
    },
});

export default function DeleteSettingItemView(props) {
    const classes = useStyles();

    const [list, setList] = useState([]);
    const [selected, setSelected] = useState([]);

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

    const isSelected = (_id) => selected.indexOf(_id) !== -1;

    useEffect(() => {
        let arr = [];

        for (const key in props.listSettingItem)
            arr = arr.concat(props.listSettingItem[key])

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
                <TableBody>
                    {
                        list.map((row, index) => {
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
                                    <TableCell align="center">{row.value}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}