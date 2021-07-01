import React, { useEffect, useState } from 'react';
import {
    TextField, Grid,
    makeStyles, Select,
    FormControl, InputLabel,
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
    const [subCategory, setSubCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');

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
        else if (type === 'subCategory') {
            setSubCategory(newValue);
        }
        else if (type === 'type') {
            setType(newValue);
        }
        props.onInfoChange(props.id, { [type]: newValue });
    }

    useEffect(() => {
        setTitle(props.title);
        setDescription(props.description);
        setCategory(props.category);
        setSubCategory(props.subCategory);
        setType(props.type);
    }, [props.title, props.description, props.category, props.subCategory, props.type]);

    const renderValueEditor = (value, name, label, type) => {
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
                name='subCategory'
                className={classes.input}
                value={subCategory} variant='outlined'
                style={{ width: '100%' }}
                inputProps={{
                    style: {
                        padding: 10
                    }
                }}
                onChange={(el) => { handleOnInfoChange(el) }}
                label='Danh mục con'
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
                <Grid item xs={12} lg={4} style={{paddingTop: '0'}}>
                    <FormControl className={classes.formControl} style={{ width: '100%' }}>
                        <InputLabel htmlFor="age-native-simple">Kiểu dữ liệu</InputLabel>
                        <Select
                            native name='type'
                            value={type}
                            onChange={handleOnInfoChange}
                            // inputProps={{
                            // }}
                        >
                            <option value='text'>Text/Number</option>
                            <option value='boolean'>Boolean</option>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={4} style={{paddingTop: '11px'}}>
                    {renderValueEditor(props.name, 'name', 'Tên cài đặt')}
                </Grid>
                <Grid item xs={12} lg={4} style={{paddingTop: '11px'}}>
                    {renderValueEditor(props.affect, 'affect', 'Đối tượng ảnh hưởng')}
                </Grid>
            </Grid>
            {/* <hr style={{marginTop: '0.5rem'}}/> */}
        </div>
    )
}