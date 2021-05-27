import React, { useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import { makeStyles, Button, Grid, Paper, Typography, TextField } from '@material-ui/core';
import { Modal, } from 'react-bootstrap';
import { formatCurrency } from '../../../helpers/helper';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import userApi from '../../../api/userApi';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
    },
    productImage: {
        maxWidth: '100%',
        borderRadius: 10,
    },
    modal: {
        // width: '80% !important',
        maxWidth: '60%'
    },
    priceInput: {
        fontSize: 20
    },
    updateButton: {
        backgroundColor: '#d16b2a',
        color: 'white',
        '&:hover': {
            backgroundColor: '#d15100',
            // color: '#5e79cb',
        },
    },
    deleteButton: {
        '&.MuiButton-outlinedSecondary': {
            color: '#d90909',
        }
    },
    buttonFooter: {
        margin: theme.spacing(1),
    }
    // modalContainer: {
    //     width: '100%',
    //     maxWidth: '100%'
    // },
}));

export default function ListItemCard({ listItem, ...props }) {
    const classes = useStyles();
    const [isShowModal, setShowModal] = useState(false);
    const [itemInfoForModal, setItemInfoForModal] = useState({});
    const [hashmapNotifyPrice, setHashmapNotifyPrice] = useState({});
    const [listItemCopy, setListItemCopy] = useState(listItem);

    const initHashmapNotifyPrice = (l) => {
        let temp = {};
        for (const el of l) {
            temp[el.itemId] = {
                isUpdated: false,
                notifyPrice: el.notifyWhenPriceLt,
            };
        }
        setHashmapNotifyPrice(temp);
    }
    const onChangeNotifyPrice = (e) => {
        let t = {
            isUpdated: hashmapNotifyPrice[itemInfoForModal.itemId].isUpdated,
            notifyPrice: e.target.value,
        }
        setHashmapNotifyPrice({...hashmapNotifyPrice, [itemInfoForModal.itemId]: t,})
    }

    const handleClickItem = (item) => { 
        setItemInfoForModal(item);
        setShowModal(true);
        if (!hashmapNotifyPrice[item.itemId].isUpdated) {
            let t = {
                isUpdated: hashmapNotifyPrice[item.itemId].isUpdated,
                notifyPrice: item.notifyWhenPriceLt,
            }
            setHashmapNotifyPrice({
                ...hashmapNotifyPrice, 
                [item.itemId]: t})
            }
    }

    const handleClickUpdate = async () => {
        if (!Number(hashmapNotifyPrice[itemInfoForModal.itemId].notifyPrice) && window.confirm("Are you sure want to remove this item from collection?")) {
            alert('Bỏ theo dõi thành công')
            setHashmapNotifyPrice({...hashmapNotifyPrice, [itemInfoForModal.itemId]: null,})
            return;
        }

        const notifyPrice = hashmapNotifyPrice[itemInfoForModal.itemId].notifyPrice;
        const resp = await userApi.updateTrackedItem(itemInfoForModal.itemId, itemInfoForModal.platform, notifyPrice);
        if (resp?.success) {
            let t = {
                isUpdated: true,
                notifyPrice: notifyPrice,
            }
            setHashmapNotifyPrice({...hashmapNotifyPrice, [itemInfoForModal.itemId]: t,})
            alert('Cập nhật giá thành công');
        }
        else 
            alert('Cập nhật giá không thành công')
    }

    const handleClickRemove = async () => {
        if (window.confirm("Bạn có chắc muốn bỏ theo dõi sản phẩm này?")) {
            const resp = await userApi.removeTrackedItem(itemInfoForModal.itemId, itemInfoForModal.platform);
            if (resp.success) {
                let t = [...listItemCopy];
                const idx = t.map(el => el.itemId).indexOf(itemInfoForModal.itemId);
                if (idx > -1) {
                    t.splice(idx, 1);
                    setListItemCopy(t);
                }

                setShowModal(false);
                setItemInfoForModal({});
                alert('Bỏ theo dõi thành công')
            }
            else 
                alert('Bỏ theo dõi không thành công')
        }
    }

    const RenderPriceChangeInModal = () => {
        if (itemInfoForModal.lastPriceChange === 0)
            return (
                <Typography style={{marginLeft: '2rem', marginBottom: '0.5rem'}} display="inline" variant="body1" color="textSecondary" component="p">
                    Chưa có biến động giá
                </Typography>
            )
        else if (itemInfoForModal.lastPriceChange > 0)
            return (
                <Typography style={{color: 'red'}} display="inline" variant="body1" color="textSecondary" component="p">
                    <ArrowUpwardIcon style={{marginBottom: '5px',}}/> {formatCurrency(itemInfoForModal.lastPriceChange)}
                </Typography>
            )
        else {
            return (
                <Typography style={{color: 'green'}} display="inline" variant="body1" color="textSecondary" component="p">
                    <ArrowDownwardIcon style={{marginBottom: '3px',}}/> {formatCurrency(itemInfoForModal.lastPriceChange)}
                </Typography>
            )
        }
    }

    const RenderListItem = () => {
        if (listItemCopy.length) {
            return listItemCopy.map(el => {
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
                            onClickItem={(item) => {handleClickItem(item)}}
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

    useEffect(() => {
        setListItemCopy(listItem);
        initHashmapNotifyPrice(listItem); // Afraid setListItemCopy is not finish before initializing hashmap
    }, [listItem]); // eslint-disable-line

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
                            <RenderPriceChangeInModal/>
                            <TextField
                                InputProps={{
                                    className: classes.priceInput,
                                    inputProps: { min: 0, step: 5000 }
                                }}
                                variant="outlined"
                                fullWidth
                                id="notify-price-input"
                                label="Giá đang theo dõi"
                                name="notify-price"
                                type='number'
                                style={{ marginTop: "1rem", marginBottom: "0" }}
                                value={hashmapNotifyPrice[itemInfoForModal.itemId]?.notifyPrice || 0}
                                onChange={onChangeNotifyPrice}
                            // error={!isValidateEmail}
                            // helperText={messageEmail}
                            // onKeyDown={handleHitEnter}
                            />
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${classes.updateButton} ${classes.buttonFooter}`} 
                        onClick={handleClickUpdate}
                    >
                        Cập nhật giá theo dõi
                    </Button>
                    <Button className={`${classes.deleteButton} ${classes.buttonFooter}`} 
                        onClick={handleClickRemove}
                        variant="outlined"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                    >
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