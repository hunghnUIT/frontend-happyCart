import React from 'react';
import { 
    Typography, makeStyles, 
} from '@material-ui/core';


import SettingItem from './SettingItem';
import EditSettingItem from './EditSettingItem';


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

    /**
     * NOTE: If JSX element contain input field. 
     * Render method SHOULD NOT declared: RenderListItemSetting and call in render: <RenderListItemSetting/>
     * SHOULD BE: renderListItemSetting (just like below) and call in render: {renderListItemSetting()}
     * unless, input field will lose focus after typing 01 CHARACTER.
     * -> Reason? Something related to render method corresponding to the way we call inside render method.
     */
    const renderListItemSetting = () => {
        if (!props.isEditMode)
            return (props.listSettingItem.map((el, idx) => (
                <SettingItem 
                    key={idx}
                    id={el._id}
                    type={el.type} description={el.description} 
                    title={el.title} value={el.value}
                    name={el.name} affect={el.affect}
                    onInfoChange={(id, newInfoObj) => {props.onInfoChange(id, newInfoObj)}}
                />)))
        else
            return (props.listSettingItem.map((el, idx) => (
                <EditSettingItem 
                    key={idx}
                    id={el._id} category={el.category}
                    type={el.type} description={el.description} 
                    title={el.title} value={el.value}
                    name={el.name} affect={el.affect}
                    onInfoChange={(id, newInfoObj) => {props.onInfoChange(id, newInfoObj)}}
                />    
        )))
    }

    return (
        <div >
            <span ref={props.refer} className={classes.anchor}></span>
            <Typography variant='h5' className={classes.root + ' ' + (props.noMarginTop ? 'mt-0' : '')}>{props.category}</Typography>
            {renderListItemSetting()}
        </div>
    )
}