import React, { useEffect, useState } from 'react';
import {
    TextField, Typography,
    makeStyles,
} from '@material-ui/core';


const useStyles = makeStyles({
    root: {
        marginBottom: '10px',
    },
    input: {
        margin: '10px 0',
    },
});

export default function SettingItem(props) {
    const classes = useStyles();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleOnInfoChange = (el, type) => {
        if (type === 'title') {
            const newValue = el.target.value;
            setTitle(newValue);
            props.onInfoChange(props.id, { title: newValue });
        }
        else if (type === 'description') {
            const newValue = el.target.value;
            setDescription(newValue);
            props.onInfoChange(props.id, { description: newValue });
        } 
    }

    useEffect(() => {
        setTitle(props.title);
        setDescription(props.description);
    }, []); //eslint-disable-line

    return (
        <div className={classes.root}>
            <TextField
                className={classes.input}
                value={title} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el, 'title') }}
                label='Tiêu đề'
            />
            <TextField
                className={classes.input}
                value={description} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el, 'description') }}
                label='Mô tả'
            />
            <Typography variant='body2'>Giá trị: {props.value}</Typography>
            <hr style={{marginTop: '0.5rem'}}/>
        </div>
    )
}