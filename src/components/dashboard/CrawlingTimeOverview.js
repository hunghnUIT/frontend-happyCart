import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";
import Chart from "../utils/chart";


import { toHumanReadableTimeFormat } from '../../helpers/helper'; //eslint-disable-line


class CrawlingTimeOverview extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
    this.state = { crawlingTimeChart: null };
  }

  componentDidMount() {
    const chartOptions = {
      // ...{
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
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  // Jump every 7 values on the X axis labels to avoid clutter.
                  return index % 7 !== 0 ? "" : tick;
                },
                // afterTickToLabelConversion: function (data) {
                //   let xLabels = data.ticks;
                //   xLabels.forEach(function (labels, i) {
                //     let labelLength = this.props.labels.length;
                //       if (labelLength >= 10 && i % Math.round(labelLength / 10 + 1) != 0) {
                //           xLabels[i] = '';
                //       }
                //   });
                // },
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45,
                callback(tick) {
                  if (tick === 0) {
                    return tick;
                  }
                  // Format the amounts using Ks for thousands.
                  return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
                }
              }
            }
          ]
        },
        hover: {
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          custom: false,
          mode: "nearest",
          intersect: false,
        //   callbacks: {
        //     label: function (tooltipItem, data) {
        //         // const itemPrice = prices[tooltipItem.index];
        //         // const priceChangeInDay = itemPrice?.priceChangeInDay || [];
                
        //         // const time = new Date(itemPrice.update);
        //         // return [`${formatter.format(itemPrice.price)} lúc ${time.getHours()}:${time.getMinutes()}.`];
        //         return [`${toHumanReadableTimeFormat(tooltipItem.xLabel)}`]
        //     }
        // }
        }
      // },
      // ...this.props.chartOptions
    };

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
      options: chartOptions
    });

    // They can still be triggered on hover.
    // const buoMeta = CrawlingTime.getDatasetMeta(0);
    // buoMeta.data[0]._model.radius = 0;
    // buoMeta.data[
    //   this.props.chartData.datasets[0].data.length - 1
    // ]._model.radius = 0;

    // Render the chart.
    CrawlingTime.render();
    this.setState({crawlingTimeChart: CrawlingTime})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataShopee !== this.props.dataShopee 
      || prevProps.dataTiki !== this.props.dataTiki
      || prevProps.labels !== this.props.labels) {
      // NOTE this will be fix if i find another to update chart (I don't want to update state like below)
      this.state.crawlingTimeChart.data.datasets[1].data = this.props.dataTiki //eslint-disable-line
      this.state.crawlingTimeChart.data.datasets[0].data = this.props.dataShopee //eslint-disable-line
      this.state.crawlingTimeChart.labels = this.props.labels; //eslint-disable-line
    
      this.state.crawlingTimeChart.update();
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
              <RangeDatePicker />
            </Col>
            <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col>
          </Row>
          <canvas
            height="120"
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
