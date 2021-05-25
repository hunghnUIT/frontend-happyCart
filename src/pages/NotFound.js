import React from 'react';
import {
    Box,
    Container,
    Typography,
    makeStyles,
} from '@material-ui/core';
import Page from '../components/Page';
import NotFound from '../PageNotFound.svg'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 460
    }
}));

const NotFoundView = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="404">
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="center">
                <Container maxWidth="md">
                    <Typography
                        align="center"
                        color="textPrimary"
                        variant="h2">
                        404: Trang bạn đang tìm kiếm không có ở đây
                    </Typography>
                    <Typography
                        align="center"
                        color="textPrimary"
                        variant="subtitle2">
                        Có thể bạn đang thử đi tới một địa chỉ nào đó hoặc bằng cách nào đó vô tình đến được đây. Hãy quay trở lại nhé.
                    </Typography>
                    <Box textAlign="center">
                        <img
                            alt="Under development"
                            className={classes.image}
                            src={NotFound}
                        />
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export default NotFoundView;
