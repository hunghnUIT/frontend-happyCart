import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../../components/common/PageTitle";
import SmallStats from "../../components/common/SmallStats";
import CrawlingTimeOverview from "../../components/dashboard/CrawlingTimeOverview";
import UsersByDevice from "../../components/dashboard/UsersByDevice";
// import NewDraft from "./../components/blog/NewDraft";
// import Discussions from "./../components/blog/Discussions";
// import TopReferrals from "./../components/common/TopReferrals";

import adminApi from '../../api/adminApi';
import CrawlingProgress from "../../components/dashboard/CrawlingProgress";

export default function Dashboard({ smallStats, ...props }) {
  // Crawling time chart
  const [crawlingTimeTiki, setCrawlingTimeTiki] = useState([]);
  const [crawlingTimeShopee, setCrawlingTimeShopee] = useState([]);
  const [labels, setLabels] = useState([]);

  // Crawling progress
  const [progressShopee, setProgressShopee] = useState({});
  const [progressTiki, setProgressTiki] = useState({});
  const [updateCount, setUpdateCount] = useState(0);

  // Small status
  const [totalItem, setTotalItem] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalCrawler, setTotalCrawler] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalTrackedItem, setTotalTrackedItem] = useState(0);
  
  useEffect(() => {
    // Get this statistic in 15 days
    const end = new Date().getTime();
    const start = end - 15 * 86400000;
    adminApi.getStatistics({ type: 'crawling-time', start, end }).then(resp => {
      if (resp?.success) {
        let labels = resp.data.shopee.map(el => el.update);
        labels = labels.concat(resp.data.tiki.map(el => el.update))
        setLabels([...new Set(labels)]);

        setCrawlingTimeShopee(resp.data.shopee.map(el => el.executionTimeInMs));
        setCrawlingTimeTiki(resp.data.tiki.map(el => el.executionTimeInMs));
      }
    }).catch(err => console.log(err.message))

    // Small stats
    const list = ['item', 'category', 'crawler', 'user', 'tracked-item'];
    list.forEach(type => {
      adminApi.getStatistics({ type: type, platform: 'all' }).then(resp => {
        if (resp?.success) {
          switch (type) {
            case 'item':
              setTotalItem(resp.data.total);
              break;
            case 'category':
              setTotalCategory(resp.data.total);
              break;
            case 'crawler':
              setTotalCrawler(resp.data.total);
              break;
            case 'user':
              setTotalUser(resp.data.total);
              break;
            case 'tracked-item':
              setTotalTrackedItem(resp.data.total);
              break;
            default:
              break;
          }
        }
      }).catch(err => console.log(err.message))
    });
  }, []);

  const fetchCrawlingProgressInfo = () => {
    const now = new Date().getTime();
    if ((Object.keys(progressShopee).length && progressShopee.shopee.expired !== 0)
      || !Object.keys(progressShopee).length || now > progressShopee.expiredTime) {
      adminApi.getStatistics({ type: 'crawling-progress', platform: 'shopee' }).then(resp => {
        if (resp?.success) {
          setProgressShopee(resp.data);
        }
      }).catch(err => console.log(err.message))
    }

    if ((Object.keys(progressTiki).length && progressTiki.tiki.expired !== 0)
      || !Object.keys(progressTiki).length || now > progressTiki.expiredTime) {
      adminApi.getStatistics({ type: 'crawling-progress', platform: 'tiki' }).then(resp => {
      if (resp?.success) {
        setProgressTiki(resp.data);
      }
      }).catch(err => console.log(err.message))
    }
  }

  useEffect(() => {
    setTimeout(() => { setUpdateCount(updateCount + 1) }, 15000); // Update after 15s

    fetchCrawlingProgressInfo();

    // Update total item
    adminApi.getStatistics({ type: 'item', platform: 'all' }).then(resp => {
      if (resp?.success) {
        setTotalItem(resp.data.total);
      }
    }).catch(err => console.log(err.message))

  }, [updateCount]) // eslint-disable-line

  const RenderProgressBarShopee = () => {
      return (<CrawlingProgress
          label='Tiến độ crawl sàn Shopee'
          updated={progressShopee.shopee?.updated || null}
          total={progressShopee.shopee?.total || null}
          expiredTime={progressShopee.expiredTime}
          executionTimeInMs={progressShopee.shopee?.executionTimeInMs || null}
          /> )
  }

  const RenderProgressBarTiki = () => {
      return (<CrawlingProgress
          label='Tiến độ crawl sàn Tiki'
          updated={progressTiki.tiki?.updated || null}
          total={progressTiki.tiki?.total || null}
          expiredTime={progressTiki.expiredTime}
          executionTimeInMs={progressTiki.tiki?.executionTimeInMs || null}
          /> )
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle title="Hệ thống HappyCart" subtitle="Bảng điều khiển" className="text-sm-left mb-3" />
      </Row>
  
      {/* Small Stats Blocks */}
      <Row>
          <Col className="col-lg mb-4" md={6} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='Tổng số sản phẩm crawl được'
              value={totalItem}
              subtitle='từ cả 2 sàn'
            />
          </Col>
          <Col className="col-lg mb-4" md={6} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='Tổng danh mục sản phẩm'
              value={totalCategory}
              subtitle='của cả 2 sàn'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='Số lượng crawler'
              value={totalCrawler}
              subtitle='đang tham gia crawl'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='Số lượng người dùng'
              value={totalUser}
              subtitle='trong hệ thống HappyCart'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='Tổng số sản phẩm được theo dõi giá'
              value={totalTrackedItem}
              subtitle='bởi người dùng HappyCart'
            />
          </Col>
      </Row> 
  
      <Row>
        <Col lg="6" md="12" sm="12" className="mb-4">
          <RenderProgressBarShopee/>
        </Col>
        <Col lg="6" md="12" sm="12" className="mb-4">
          <RenderProgressBarTiki/>
        </Col>
      </Row>

      <Row>
        {/* Users Overview */}
        <Col lg="8" md="12" sm="12" className="mb-4">
          <CrawlingTimeOverview 
            dataTiki={crawlingTimeTiki} 
            dataShopee={crawlingTimeShopee}
            labels={labels}
          >
          </CrawlingTimeOverview>
        </Col>
  
        {/* Users by Device */}
        <Col lg="4" md="6" sm="12" className="mb-4">
          <UsersByDevice />
        </Col>
      </Row>
    </Container>
  )
}

Dashboard.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

Dashboard.defaultProps = {
  smallStats: [
    {
      label: "Posts",
      value: "2,390",
      percentage: "4.7%",
      increase: true,
      attrs: { md: "6", sm: "6" },
      // datasets: [
      //   {
      //     label: "Today",
      //     fill: "start",
      //     borderWidth: 1.5,
      //     backgroundColor: "rgba(0, 184, 216, 0.1)",
      //     borderColor: "rgb(0, 184, 216)",
      //     data: [null, null]
      //   }
      // ]
    },
    {
      label: "Pages",
      value: "182",
      percentage: "12.4",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(23,198,113,0.1)",
          borderColor: "rgb(23,198,113)",
          data: [1, 2, 3, 3, 3, 4, 4]
        }
      ]
    },
    {
      label: "Comments",
      value: "8,147",
      percentage: "3.8%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,180,0,0.1)",
          borderColor: "rgb(255,180,0)",
          data: [2, 3, 3, 3, 4, 3, 3]
        }
      ]
    },
    {
      label: "New Customers",
      value: "29",
      percentage: "2.71%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,65,105,0.1)",
          borderColor: "rgb(255,65,105)",
          data: [1, 7, 1, 3, 1, 4, 8]
        }
      ]
    },
    {
      label: "Subscribers",
      value: "17,281",
      percentage: "2.4%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgb(0,123,255,0.1)",
          borderColor: "rgb(0,123,255)",
          data: [3, 2, 3, 2, 4, 5, 4]
        }
      ]
    }
  ]
};