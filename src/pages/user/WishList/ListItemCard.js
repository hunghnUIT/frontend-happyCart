import React from 'react';
import ItemCard from './ItemCard';
import { makeStyles, Grid } from '@material-ui/core';


const useStyles = makeStyles({

});
export default function ListItemCard({ listItem, ...props }) {
    const classes = useStyles();
    const RenderListItem = () => {
        if (listItem.length) {
            return listItem.map(el => {
                const item = el.item || {};
                return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <ItemCard
                            name={item.name}
                            thumbnailUrl={item.thumbnailUrl}
                            productUrl={item.productUrl}
                            currentPrice={item.currentPrice}
                            lastPriceChange={item.lastPriceChange}
                            update={item.update}
                        >
                        </ItemCard>
                    </Grid>
                )
            })
        }
        else
            return null;
    }
    return (
        <Grid className={classes.root}
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            <RenderListItem/>
        </Grid>
    )
};