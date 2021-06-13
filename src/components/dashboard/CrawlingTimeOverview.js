import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody } from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";
import Chart from "../utils/chart";


import { toHumanReadableTimeFormat, toVietnameseTimeFormat } from '../../helpers/helper' 



class CrawlingTimeOverview extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.state = { crawlingTimeChart: null };
  }

  chartOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    elements: {
      line: {
        // A higher value makes the line look skewed at this ratio.
        tension: 0.3
      },
      point: {
        radius: 0
      }
    },
    scales: {
      x: {
          grid: {
            display: false,
          },
          ticks: {
            display: true,
            autoSkip: true,
            maxTicksLimit: 15,
            callback: (value, index) => {
              let temp = this.props.labels?.[index] || '';
              return ((temp.split(', '))[0]);
            }
          }
        },
      y: {
        ticks: {
          suggestedMax: 45,
          callback(tick) {
            if (tick === 0) {
              return tick;
            }
            return toHumanReadableTimeFormat(tick);
          }
        }
      }
    },
    hover: {
      mode: "nearest",
      intersect: false
    },
    plugins: {
      tooltip: {
        custom: false,
        mode: "nearest",
        intersect: false,
        callbacks: {
          title: function(context) {
            return `Nhật ký ngày ${context[0].label}`;
          },
          label: function (context) {
            return `Mất ${toVietnameseTimeFormat(context.parsed.y)} để hoàn thành`;
          },
          labelColor: function(context) {
            if (context.dataset?.label?.includes('Shopee'))
              return {
                borderColor: '#f51616',
                backgroundColor: '#ff6161',
                borderRadius: 2,
              };
            else
              return {
                borderColor: '#004ef5',
                backgroundColor: '#3986fa',
                borderRadius: 2,
              };
          },
        }
      },
    }
  };

  componentDidMount() {
    const CrawlingTime = new Chart(this.canvasRef.current, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Thời gian crawl sàn Tiki",
            fill: "start",
            data: [],
            backgroundColor: "rgba(0,123,255,0.1)",
            borderColor: "rgba(0,123,255,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgb(0,123,255)",
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 3
          },
          {
            label: "Thời gian crawl sàn Shopee",
            fill: "start",
            data: [],
            backgroundColor: "rgba(255,65,105,0.1)",
            borderColor: "rgba(255,65,105,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgba(255,65,105,1)",
            borderDash: [3, 3],
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 2,
            pointBorderColor: "rgba(255,65,105,1)"
          }
        ]
      },
      options: this.chartOptions
    });

    // Render the chart.
    CrawlingTime.render();
    this.setState({crawlingTimeChart: CrawlingTime})
  }

  componentDidUpdate(prevProps) {
    let flag = 0;
    // NOTE this will be fix if i find another to update chart (I don't want to update state like below)
    if (prevProps.dataShopee !== this.props.dataShopee && this.props?.dataShopee.length) {
      flag += 1;
      this.state.crawlingTimeChart.data.datasets[0].data = this.props.dataShopee //eslint-disable-line
    }
    if (prevProps.dataTiki !== this.props.dataTiki  && this.props?.dataTiki.length) {
      flag += 1;
      this.state.crawlingTimeChart.data.datasets[1].data = this.props.dataTiki //eslint-disable-line
    }

    if (prevProps.labels !== this.props.labels  && this.props?.labels.length) {
      flag += 1;

      let temp = (this.props.labels);
      this.state.crawlingTimeChart.labels = temp; //eslint-disable-line
    }
    if (flag) {
      // this.state.crawlingTimeChart.update();
      this.state.crawlingTimeChart.destroy();
      const CrawlingTime = new Chart(this.canvasRef.current, {
        type: "line",
        // data: this.props.chartData,
        data: {
          labels: this.props.labels,
          datasets: [
            {
              label: "Thời gian crawl sàn Tiki",
              fill: "start",
              data: this.props.dataTiki,
              backgroundColor: "rgba(0,123,255,0.1)",
              borderColor: "rgba(0,123,255,1)",
              pointBackgroundColor: "#ffffff",
              pointHoverBackgroundColor: "rgb(0,123,255)",
              borderWidth: 1.5,
              pointRadius: 0,
              pointHoverRadius: 3
            },
            {
              label: "Thời gian crawl sàn Shopee",
              fill: "start",
              data: this.props.dataShopee,
              backgroundColor: "rgba(255,65,105,0.1)",
              borderColor: "rgba(255,65,105,1)",
              pointBackgroundColor: "#ffffff",
              pointHoverBackgroundColor: "rgba(255,65,105,1)",
              borderDash: [3, 3],
              borderWidth: 1,
              pointRadius: 0,
              pointHoverRadius: 2,
              pointBorderColor: "rgba(255,65,105,1)"
            }
          ]
        },
        options: this.chartOptions
      });
      CrawlingTime.render();
      this.setState({crawlingTimeChart: CrawlingTime})
    }
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <RangeDatePicker 
                onDateChange={(start, end) => {
                  this.props.handleTimeRangeChange(start.getTime(), end.getTime());
                }}
              />
            </Col>
            {/* <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col> */}
          </Row>
          <canvas
            height="150"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
  }
}

CrawlingTimeOverview.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

CrawlingTimeOverview.defaultProps = {
  title: "Tổng quan thời gian crawl",
  labels: [],
  // labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
  dataTiki: [],
  dataShopee: [],
};

export default CrawlingTimeOverview;
