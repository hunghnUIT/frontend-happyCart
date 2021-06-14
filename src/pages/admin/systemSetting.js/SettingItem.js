import React from 'react';
import {
    TextField, Typography,
    makeStyles, Select,
} from '@material-ui/core';


const useStyles = makeStyles({
    root: {
        marginBottom: '10px',
    }
});

export default function SystemSetting(props) {
    const classes = useStyles();

    const RenderValueEditor = () => {
        if (props.type === 'text')
            return (
                <TextField
                value='2' variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 5
                    }
                }}>
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
            <Typography variant='subtitle1'>{props.title}</Typography>
            <Typography variant='body2'>{props.description}</Typography>
            <RenderValueEditor/>
        </div>
    )
}