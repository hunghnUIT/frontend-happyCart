import clsx from 'clsx';
import {
    Toolbar, Typography, 
    Tooltip, IconButton,
    Paper, InputBase,
} from "@material-ui/core";
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import { useState } from 'react';


const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 75%',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        display: 'inline',
        padding: 10,
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    const [searchValue, setSearchValue] = useState('')

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    Đã chọn {numSelected} người dùng
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Danh sách người dùng
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Xóa người dùng">
                    <IconButton aria-label="delete" onClick={props.onClickDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                // <Tooltip title="Filter list">
                //     <IconButton aria-label="filter list">
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
                <Paper className={classes.root}>
                    <InputBase
                        className={classes.input}
                        placeholder="Tìm theo tên, email"
                        inputProps={{ 'aria-label': 'tìm kiếm người dùng' }}
                        onChange={async (e) => {
                            const term = e.target.value;
                            await setSearchValue(term);
                            props.onChangeUserSearchBar(term);
                        }}
                        value={searchValue}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;