import React, { useState } from 'react';
import ItemCard from './ItemCard';
import { makeStyles, Button, Grid, Paper, Typography, TextField } from '@material-ui/core';
import { Modal, } from 'react-bootstrap';
import { formatCurrency } from '../../../helpers/helper';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const useStyles = makeStyles({
    productImage: {
        maxWidth: '100%',
        borderRadius: 10,
    },
    modal: {
        // width: '80% !important',
        maxWidth: '60%'
    },
    // modalContainer: {
    //     width: '100%',
    //     maxWidth: '100%'
    // },
});
export default function ListItemCard({ listItem, ...props }) {
    const classes = useStyles();
    const [isShowModal, setShowModal] = useState(false);
    const [itemInfoForModal, setItemInfoForModal] = useState({});

    const onChangeNotifyPrice = (e) => {
        setItemInfoForModal({
            ...itemInfoForModal,
            notifyWhenPriceLt: e.target.value,
        })
    }

    const handleClickUpdate = () => {
        // itemId, platform, price
        console.log(itemInfoForModal.itemId);
        console.log(itemInfoForModal.platform);
        console.log(Number(itemInfoForModal.notifyWhenPriceLt));
    }

    const handleClickRemove = () => {
        // itemId, platform
        console.log(itemInfoForModal.itemId);
        console.log(itemInfoForModal.platform);
    }

    const RenderListItem = () => {
        if (listItem.length) {
            return listItem.map(el => {
                const item = el.item || {};
                return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <ItemCard
                            itemId={el.itemId}
                            platform={item.platform}
                            name={item.name}
                            thumbnailUrl={item.thumbnailUrl}
                            productUrl={item.productUrl}
                            currentPrice={item.currentPrice}
                            lastPriceChange={item.lastPriceChange}
                            update={item.update}
                            onClickItem={(item) => { 
                                setItemInfoForModal(item);
                                setShowModal(true);
                            }}
                            notifyWhenPriceLt={el.notifyWhenPriceLt} 
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
        <>
            <Modal dialogClassName={classes.modal} className={classes.modalContainer}
                show={isShowModal}
                onHide={() => {setShowModal(false)}}
                aria-hidden='true'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Sản phẩm đang theo dõi giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid container
                        spacing={1}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} md={3}>
                            <Paper>
                                <img className={classes.productImage} src={itemInfoForModal.thumbnailUrl} alt='product images'></img>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Typography gutterBottom variant="h6" component="h2">
                                <a style={{ color: '#d16b2a' }} href={itemInfoForModal.productUrl}>{itemInfoForModal.name}</a>
                            </Typography>
                            <Typography display="inline" variant="h6" color="textPrimary" component="p">
                                Giá hiện tại: {formatCurrency(itemInfoForModal.currentPrice)}
                                
                            </Typography>
                            <Typography display="inline" variant="body1" color="textSecondary" component="p">
                                <ArrowUpwardIcon/> {formatCurrency(itemInfoForModal.lastPriceChange)}
                            </Typography>
                            <TextField
                                InputProps={{
                                    className: classes.searchComponent
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="notify-price-input"
                                label="Giá đang theo dõi"
                                name="notify-price"
                                style={{ marginTop: "0", marginBottom: "0" }}
                                value={itemInfoForModal.notifyWhenPriceLt}
                                onChange={onChangeNotifyPrice}
                            // error={!isValidateEmail}
                            // helperText={messageEmail}
                            // onKeyDown={handleHitEnter}
                            />
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClickUpdate}>
                        Cập nhật giá theo dõi
                    </Button>
                    <Button onClick={handleClickRemove}>
                        Hủy theo dõi sản phẩm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Grid className={classes.root}
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                <RenderListItem/>
            </Grid>
        </>
    )
};