import React, { useEffect, useState } from 'react';
import {
    TextField, Typography,
    makeStyles, FormControlLabel,
    Grid, Switch,
} from '@material-ui/core';

import { parseBoolean } from '../../../helpers/helper'


const useStyles = makeStyles({
    root: {
        padding: '20px 8px',
        "&:hover": {
            backgroundColor: '#f5f5f5',
        },
        borderRadius: '5px',
        marginBottom: '5px',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '1.05rem',
    },
});

export default function SettingItem(props) {
    const classes = useStyles();

    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [affect, setAffect] = useState([]);

    const handleOnValueChange = (el) => {
        const targetName = el.target.name;
        let newValue = el.target.value || el.target.checked;
        switch (targetName) {
            case 'value':
                setValue(newValue);
                break;
            case 'name':
                setName(newValue.replace(/\s/g, '_'));
                break;
            case 'affect':
                newValue = newValue.split(',');
                newValue = newValue.map(el => el.replace(/\s/g, '_'));
                setAffect(newValue);
                break;
            default:
                break;
        }
        // props.onValueChange(props.id, newValue);
        props.onInfoChange(props.id, { [targetName]: newValue })
    }

    useEffect(() => {
        if (props.type === 'boolean')
            setValue(parseBoolean(props.value));
        else
            setValue(props.value);
        setName(props.name);
        setAffect(props.affect);
    }, [props.type, props.value, props.name, props.affect]);

    const renderValueEditor = (value, name, label, type) => {
        if (type === 'boolean')
            return (
                <FormControlLabel
                    control={
                        <Switch
                            checked={value}
                            name={name}
                            color="primary"
                            onChange={(el) => { handleOnValueChange(el) }}
                        />
                    }
                    label="Ho???t ?????ng"
                />
            )
        else
            return (
                <TextField
                    name={name}
                    value={value} variant='outlined'
                    style={{ width: '100%' }}
                    inputProps={{
                        style: {
                            padding: 10
                        }
                    }}
                    label={label}
                    onChange={(el) => { handleOnValueChange(el) }}
                >
                </TextField>
            )
    }

    return (
        <div className={classes.root}>
            <Typography variant='subtitle1' className={classes.title}>{props.title}</Typography>
            <Typography variant='body2'>{props.description}</Typography>
            <Grid container spacing={2} style={{ marginTop: '5px' }}>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(value, 'value', 'Gi?? tr???', props.type)}
                </Grid>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(name, 'name', 'T??n c??i ?????t')}
                </Grid>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(affect, 'affect', '?????i t?????ng ???nh h?????ng')}
                </Grid>
            </Grid>
        </div>
    )
}