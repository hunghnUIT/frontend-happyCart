import React from 'react';
import {  
    PieChart, 
    Pie, Cell,
    Label,
} from 'recharts';


const COLORS = ['#1eb7ff', '#33ae9a', '#dee2e6'];

// const renderTooltip = ({ active, payload }) => {
//     if (!active)    return null
// }

const TinyDonutChart = (props) => (
    <PieChart width={ props.width } height={ props.height }>
        {/* {props.showTooltip ? <Tooltip content={renderTooltip}/> : null} */}
        <Pie
            data={props.data}
            dataKey="value"
            // stroke={ colors['white'] }
            innerRadius={ props.innerRadius }
            outerRadius={ props.outerRadius } 
            fill="#8884d8"
        >
            <Label value={props.label} offset={5} position="center"/>
            {
                props.data.map((entry, index) => <Cell key={ index } fill={COLORS[index]}/>)
            }
        </Pie>
    </PieChart>
);

export { TinyDonutChart };
