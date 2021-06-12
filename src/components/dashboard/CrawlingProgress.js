import React from "react";
import classNames from "classnames";
// import shortid from "shortid";
import { Card, CardBody } from "shards-react";
import { Box, LinearProgress, Typography, Tooltip } from "@material-ui/core";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import UpdateIcon from '@material-ui/icons/Update';
import TimerIcon from '@material-ui/icons/Timer';
import { Row, Col } from "shards-react";

import {
    toHumanReadableTimeFormat, calculatePercent,
    formatNumber,
} from '../../helpers/helper';

class CrawlingProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // countdownTime: toHumanReadableTimeFormat(this.props.expiredTime - new Date().getTime()),
            // countdownTime: '',
        }
        // this.canvasRef = React.createRef();
    }

    countdown = (time) => {
        var int = setInterval(() => {
            this.setState({countdownTime: toHumanReadableTimeFormat(time)});
            time -= 1000 || clearInterval(int);  //if i is 0, then stop the interval
        }, 1000);
    }

    componentDidMount() {
        let countdownTime = this.props.expiredTime - new Date().getTime();
        this.setState({countdownTime: toHumanReadableTimeFormat(countdownTime)})
        this.countdown(countdownTime);
    }

    render() {
        const { variation, label, updated, total } = this.props;

        const progressBarClass = classNames(
            'w-100',
            'my-3'
        )
        const cardClasses = classNames(
            "stats-small",
            variation && `stats-small--${variation}`
        );

        const cardBodyClasses = classNames(
            variation === "1" ? "p-0 d-flex" : "px-0 pb-0"
        );

        const innerWrapperClasses = classNames(
            // "d-flex",
            variation === "1" ? "flex-column m-auto" : "px-3"
        );

        const dataFieldClasses = classNames(
            "stats-small__data",
            variation === "1" && "text-center"
        );

        const labelClasses = classNames(
            variation !== "1" && "mb-1"
        );

        const iconClasses = classNames(
            'mr-1'
        )

        const RenderSuitableTimingValue = () => {
            if (this.props.executionTimeInMs)
                return (
                    <>
                        <Tooltip title="Thời gian hoàn thành" aria-label="add">
                            <TimerIcon className={iconClasses} />
                        </Tooltip>
                        {toHumanReadableTimeFormat(this.props.executionTimeInMs)}
                    </>
                )
            else
                return (
                    <>
                        <Tooltip title="Thời gian tới lần crawl tiếp theo" aria-label="add">
                            <UpdateIcon className={iconClasses} />
                        </Tooltip>
                        {this.state.countdownTime}
                    </>
                )
        }
        return (
            <Card small className={cardClasses}>
                <CardBody className={cardBodyClasses}>
                    <div className={innerWrapperClasses}>
                        <div className={dataFieldClasses}>
                            <span className={labelClasses}>{label}</span>
                        </div>
                        {
                            (!updated || !total) ? 
                            <>
                                <div className={progressBarClass}>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress />
                                        </Box>
                                    </Box>
                                </div>
                            </> 
                            : <>
                                <div className={progressBarClass}>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress variant="determinate" value={calculatePercent(updated, total)} {...this.props} />
                                        </Box>
                                        <Box minWidth={35}>
                                            <Typography variant="body2" color="textSecondary">{`${Math.round(
                                                calculatePercent(updated, total)
                                            )}%`}</Typography>
                                        </Box>
                                    </Box>
                                </div>
                                <Row>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <Tooltip title="Tổng số sản phẩm" aria-label="add">
                                            <AccountTreeIcon className={iconClasses} />
                                        </Tooltip>
                                        {formatNumber(total)}
                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <Tooltip title="Đã cập nhật" aria-label="add">
                                            <DoneAllIcon className={iconClasses} style={{ color: 'green' }} />
                                        </Tooltip>
                                        {formatNumber(updated)}
                                    </Col>
                                    <Col lg="4" md="12" sm="12" className="mb-4">
                                        <RenderSuitableTimingValue/>
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default (CrawlingProgress);