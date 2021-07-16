import React from 'react';
import {  
    PieChart, 
    Pie, Cell,
    Label, Tooltip,
    Legend,
} from 'recharts';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    customTooltip: {
        opacity: '0.75',
        color: 'white',
        backgroundColor: 'black',
        borderRadius: '5px',
        padding: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));


const COLORS = ['#1eb7ff', '#33ae9a', '#dee2e6'];

const TinyDonutChart = (props) => {
    const classes = useStyles();

    const renderTooltip = ({ active, payload }) => {
        if (active) {
            return (
                <div className={classes.customTooltip}>
                    <div style={{width: '15px', height: '10px', backgroundColor: payload[0].payload.fill, border: '1px white solid'}} className='mr-2'></div>
                    <div>{`${payload[0].name}: ${(props.numericalData[payload[0].name]).toFixed(1)} ${props.displayInTooltipUnit}`}</div>
                </div>
            )
        }
        return null;
    }
    
    return (
        <PieChart width={ props.width } height={ props.height }>
            {props.showTooltip ? <Tooltip content={renderTooltip} wrapperStyle={{width: props.wrapperWidth ? props.wrapperWidth : 'fit-content' }}/> : null}
            <Pie
                data={props.data}
                dataKey="value"
                // stroke={ colors['white'] }
                innerRadius={ props.innerRadius }
                outerRadius={ props.outerRadius } 
                fill="#8884d8"
            >
                <Label value={props.label} offset={5} position="center"/>
                <Legend />
                {
                    props.data.map((entry, index) => <Cell key={ index } fill={COLORS[index]}/>)
                }
            </Pie>
        </PieChart>
    )};

export { TinyDonutChart };
