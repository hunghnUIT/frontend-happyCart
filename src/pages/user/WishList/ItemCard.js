import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardActionArea, CardMedia, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { limitDisplayString, formatCurrency, formatDateTime } from '../../../helpers/helper';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        borderRadius: 13,
    },
    media: {
        height: 300,
    },
    title: {
        fontSize: 14,
    },
    centerTypo: {
        alignItems: 'center',
        textAlign: 'center',
    },
    decreasedPrice: {
        color: '#00ad0c',
    },
    increasedPrice: {
        color: '#e80c0c',
    }
});

export default function ItemCard({ currentPrice, lastPriceChange, name, update, thumbnailUrl, productUrl, onClickItem, ...props }) {
    const classes = useStyles();

    const RenderPriceInfo = () => {
        if (lastPriceChange) {
            return (
                <>
                    <Grid item xs={12} sm={5}>
                        <Typography display="block" variant="body1" color="textPrimary" component="p">
                            Giá cũ
                        </Typography>
                        <Typography display="block" variant="subtitle1" color="textPrimary" component="p" style={{textDecoration: 'line-through'}}>
                            {formatCurrency(currentPrice - lastPriceChange)}
                        </Typography>
                    </Grid>
    
                    <Grid item xs={12} sm={7}>
                        <Typography className={lastPriceChange < 0 ? 'decreasedPrice' : 'increasedPrice'} display="block" variant="body1" color="textPrimary" component="p">
                            Giá mới
                        </Typography>
                        <Typography className={lastPriceChange < 0 ? classes.decreasedPrice : classes.increasedPrice} display="block" variant="h6" color="textPrimary" component="p">
                            {formatCurrency(currentPrice)}
                        </Typography>
                    </Grid>
                </>
            )
        }
        else {
            return (
                <>
                    <Grid item xs={12} sm={12}>
                        <Typography display="block" variant="body1" color="textPrimary" component="p">
                            Giá hiện tại
                        </Typography>
                        <Typography display="block" variant="h6" color="textPrimary" component="p">
                            {formatCurrency(currentPrice)}
                        </Typography>
                    </Grid>
                </>
            )
        }
    };
    return (
        <Card className={classes.root}>
            <CardActionArea
                onClick={() => { onClickItem({
                    name, currentPrice,
                    lastPriceChange, update, 
                    thumbnailUrl, productUrl,
                    notifyWhenPriceLt: props.notifyWhenPriceLt,
                    ...props,
                })}}>
                <CardMedia
                    component="img"
                    className={classes.media}
                    image={thumbnailUrl}
                    title={name}
                />
                <CardContent>
                <Grid container spacing={3} className={classes.centerTypo}>
                    <RenderPriceInfo/>
                </Grid>
                <Typography gutterBottom variant="h6" component="h2">
                    <a style={{ color: '#d16b2a' }} href={productUrl}>{limitDisplayString(name)}</a>
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom align="right">
                    Cập nhật: {formatDateTime(update)}
                </Typography>
            </CardContent>
        </CardActionArea>
        </Card >
    )
}