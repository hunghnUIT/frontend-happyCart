import React, { useEffect, useState } from 'react';
import {
    TextField, Typography,
    makeStyles, Select,
    Grid,
} from '@material-ui/core';


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
        let newValue = el.target.value;
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
        setValue(props.value);
        setName(props.name);
        setAffect(props.affect);
    }, [props.value, props.name, props.affect]);

    const renderValueEditor = (value, name, label, type) => {
        if (type === 'boolean')
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
            <Grid container spacing={2} style={{marginTop: '5px'}}>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(value, 'value', 'Giá trị', props.type)}
                </Grid>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(name, 'name', 'Tên cài đặt')}
                </Grid>
                <Grid item xs={12} lg={12}>
                    {renderValueEditor(affect, 'affect', 'Đối tượng ảnh hưởng')}
                </Grid>
            </Grid>
        </div>
    )
}