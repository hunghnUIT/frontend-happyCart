import React, { useEffect, useState } from 'react';
import {
    TextField, Grid,
    makeStyles, Select,
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
    input: {
        margin: '10px 0',
    },
});

export default function SettingItem(props) {
    const classes = useStyles();

    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleOnInfoChange = (el) => {
        const type = el.target.name;
        const newValue = el.target.value;
        if (type === 'title') {
            setTitle(newValue);
        }
        else if (type === 'description') {
            setDescription(newValue);
        } 
        else if (type === 'category') {
            setCategory(newValue);
        }
        props.onInfoChange(props.id, { [type]: newValue });
    }

    useEffect(() => {
        setTitle(props.title);
        setDescription(props.description);
        setCategory(props.category);
    }, []); //eslint-disable-line

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
                    disabled
                    name={name}
                    value={value} variant='outlined'
                    style={{ width: '100%' }}
                    inputProps={{
                        style: {
                            padding: 10
                        }
                    }}
                    label={label}
                >
                </TextField>
            )
    }

    return (
        <div className={classes.root}>
            <TextField
                name='category'
                className={classes.input}
                value={category} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el) }}
                label='Danh mục'
            />
            <TextField
                name='title'
                className={classes.input}
                value={title} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el) }}
                label='Tiêu đề'
            />
            <TextField
                name='description'
                className={classes.input}
                value={description} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el) }}
                label='Mô tả'
            />
            <Grid container spacing={2} style={{marginTop: '5px'}}>
                <Grid item xs={12} lg={4}>
                    {renderValueEditor(props.value, 'value', 'Giá trị', props.type)}
                </Grid>
                <Grid item xs={12} lg={4}>
                    {renderValueEditor(props.name, 'name', 'Tên cài đặt')}
                </Grid>
                <Grid item xs={12} lg={4}>
                    {renderValueEditor(props.affect, 'affect', 'Đối tượng ảnh hưởng')}
                </Grid>
            </Grid>
            {/* <hr style={{marginTop: '0.5rem'}}/> */}
        </div>
    )
}