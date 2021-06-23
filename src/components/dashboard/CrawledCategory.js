import React from "react";
import PropTypes from "prop-types";
import {
  Row, Col,
  Card, CardHeader,
  CardBody, CardFooter
} from "shards-react";
import {
  Table, TableContainer,
  TableCell, TableHead,
  TableBody, TableRow,
} from '@material-ui/core';
import { Modal, } from 'react-bootstrap';
import { formatNumber, toVietnameseTimeFormat } from "../../helpers/helper";

class CrawledCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
    }
  }

  componentDidMount() {
  }

  renderData = () => {
    let result = [];
    if (this.props.data?.length) {
      let i = 0
      for (const el of this.props.data) {
        if (i < this.props.limitDisplay) {
          result.push(
            <TableRow>
                <TableCell>{el.data.categoryName}</TableCell>
                <TableCell align='center'>{el.data.count}</TableCell>
              </TableRow>
            )
          i += 1;
        }
        else
          break
      }
    }
    return result;
  }

  renderModalData = () => {
    if (this.props.data?.length) {
      return this.props.data.sort((a,b) => b.update-a.update).map((el, idx) => {
        return (
          <TableRow>
              <TableCell>{el.data.categoryName}</TableCell>
              <TableCell align='center'>{el.crawler.toLowerCase()?.includes('tiki') ? 'Tiki' : ' Shopee'}</TableCell>
              <TableCell align='center'>{formatNumber(el.data.count)}</TableCell>
              <TableCell align='center'>{toVietnameseTimeFormat(el.data.executionTimeInMs, true)}</TableCell>
            </TableRow>
          )
      });
    }
    else return []
  }

  render() {
    const { title } = this.props;
    return (
      <>
        <Card small className="h-100">
          <CardHeader className="border-bottom">
            <h6 className="m-0">{title}</h6>
          </CardHeader>
          <CardBody className="d-flex py-0">
            <TableContainer>
              <Table bordered hover={false}
                  // className={classes.table}
                  aria-labelledby="tableTitle"
                  aria-label="enhanced table"
              >
                  <TableHead>
                      <TableCell scope="row">Tên danh mục</TableCell>
                      <TableCell>Số sản phẩm</TableCell>
                  </TableHead>
                  <TableBody>
                    {this.renderData()}
                  </TableBody>
              </Table>
          </TableContainer>
          </CardBody>
          <CardFooter className="border-top">
            <Row>
              <Col>
                {/* <FormSelect
                  size="sm"
                  value="last-week"
                  style={{ maxWidth: "130px" }}
                  onChange={() => {}}
                >
                  <option value="last-week">Last Week</option>
                  <option value="today">Today</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-year">Last Year</option>
                </FormSelect> */}
              </Col>
              <Col className="text-right view-report">
                {/* eslint-disable-next-line */}
                <a onClick={() => this.setState({isShowModal: true}) }>Xem đầy đủ thông tin &rarr;</a>
              </Col>
            </Row>
          </CardFooter>
        </Card>
        <Modal 
          // dialogClassName={classes.modal} className={classes.modalContainer}
          size='lg'
          show={this.state.isShowModal}
          onHide={() => { this.setState({isShowModal: false}) }}
          aria-hidden='true'
        >
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết các danh mục vừa crawl được</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-0 pt-0'>
              <TableContainer>
                <Table bordered hover={false}
                    // className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                >
                    <TableHead>
                        <TableCell scope="row">Tên danh mục</TableCell>
                        <TableCell align='center'>Sàn TMĐT</TableCell>
                        <TableCell align='center'>Số sản phẩm crawl được</TableCell>
                        <TableCell align='center'>Thời gian thực thi</TableCell>
                    </TableHead>
                    <TableBody>
                      {this.renderModalData()}
                    </TableBody>
                </Table>
            </TableContainer>
            </Modal.Body>
        </Modal>
      </>
    );
  }
}

CrawledCategory.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The data object.
   */
  data: PropTypes.object,
};

CrawledCategory.defaultProps = {
  title: "Các danh mục vừa crawl được",
  data: [],
};

export default CrawledCategory;
