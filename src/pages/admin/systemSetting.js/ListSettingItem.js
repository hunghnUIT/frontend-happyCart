import React from 'react';
import { 
    Typography, makeStyles, 
} from '@material-ui/core';


import SettingItem from './SettingItem';


const useStyles = makeStyles({
    root: {
        marginTop: '25px',
        color: '#0070ba',
        fontWeight:'bold',
    },
    anchor: {
        display: 'block',
        height: '70px', /*same height as header*/
        marginTop: '-70px', /*same height as header*/
        visibility:'hidden',
    },
});


export default function ListSettingItem (props) {
    const classes = useStyles();

    const renderListItemSetting = () => {
        return (props.listSettingItem.map(el => (
            <SettingItem 
                type={el.type} description={el.description} title={el.title}
            />
        )))
    }

    return (
        <div >
            <span id={props.categoryId} className={classes.anchor}></span>
            <Typography variant='h5' className={classes.root}>{props.category}</Typography>
            {renderListItemSetting()}
        </div>
    )
}