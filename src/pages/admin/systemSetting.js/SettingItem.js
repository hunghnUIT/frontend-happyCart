import React, { useEffect, useState } from 'react';
import {
    TextField, Typography,
    makeStyles, Select,
} from '@material-ui/core';


const useStyles = makeStyles({
    root: {
        marginBottom: '10px',
    },
    title: {
        fontWeight: 'bold',
    },
});

export default function SettingItem(props) {
    const classes = useStyles();

    const [value, setValue] = useState('');

    const handleOnValueChange = (el) => {
        const newValue = el.target.value;
        setValue(newValue);
        props.onValueChange(props.id, newValue);
    }

    useEffect(() => {
        setValue(props.value);
    }, []); //eslint-disable-line

    const renderValueEditor = () => {
        if (props.type === 'text')
            return (
                <TextField
                value={value} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 5
                    }
                }}
                onChange={(el) => { handleOnValueChange(el) }}
                >
                </TextField>
            )
        else
            return (
            <Select
                native
                // value={state.age}
                // onChange={handleChange}
                // inputProps={{
                // }}
                style={{ width: '20%' }}
            >
                    <option value={true}>Active</option>
                    <option value={false}>Disable</option>
            </Select>
            )
    }

    return (
        <div className={classes.root}>
            <Typography variant='subtitle1' className={classes.title}>{props.title}</Typography>
            <Typography variant='body2'>{props.description}</Typography>
            {renderValueEditor()}
        </div>
    )
}