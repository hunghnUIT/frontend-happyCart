import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../../components/common/PageTitle";
import SmallStats from "../../components/common/SmallStats";
import CrawlingTimeOverview from "../../components/dashboard/CrawlingTimeOverview";
import CrawledCategory from "../../components/dashboard/CrawledCategory";
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
  const [timeRange, setTimeRange] = useState({});

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
  const [crawledCategoryData, setCrawledCategoryData] = useState({});
  
  useEffect(() => {
  // Small stats
    const list = ['item', 'category', 'crawler', 'user', 'tracked-item', 'crawled-category'];
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
            case 'crawled-category':
              setCrawledCategoryData(resp.data);
              break;
            default:
              break;
          }
        }
      }).catch(err => console.log(err.message))
    });
  }, []);

  useEffect(() => {
    // Get this statistic default is in range 15 days
    let start = undefined;
    let end = undefined;

    end = new Date().getTime();
    start = end - 15 * 86400000;

    if (timeRange?.start)
      start = timeRange.start;
    if (timeRange?.end)
      end = timeRange.end;

    adminApi.getStatistics({ type: 'crawling-time', start, end }).then(resp => {
      if (resp?.success) {
        let labels = resp.data.shopee.map(el => el.update);
        labels = labels.sort((a,b) => a-b)
        labels = labels.map(el => (new Date(el)).toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' }));
        setLabels(labels);

        const compare = (a, b) => a.update - b.update

        setCrawlingTimeShopee(resp.data.shopee.sort(compare).map(el => el.executionTimeInMs));
        setCrawlingTimeTiki(resp.data.tiki.sort(compare).map(el => el.executionTimeInMs));
      }
    }).catch(err => console.log(err.message))
  }, [timeRange])

  const fetchCrawlingProgressInfo = () => {
    let flag = 0;

    const now = new Date().getTime();
    if ((Object.keys(progressShopee).length && progressShopee.shopee.expired !== 0)
      || !Object.keys(progressShopee).length || now > progressShopee.expiredTime) {

      flag += 1;

      adminApi.getStatistics({ type: 'crawling-progress', platform: 'shopee' }).then(resp => {
        if (resp?.success) {
          setProgressShopee(resp.data);
        }
      }).catch(err => console.log(err.message))
    }

    if ((Object.keys(progressTiki).length && progressTiki.tiki.expired !== 0)
      || !Object.keys(progressTiki).length || now > progressTiki.expiredTime) {

      flag += 1;

      // Just need to update total item whenever crawling still on going
      adminApi.getStatistics({ type: 'crawling-progress', platform: 'tiki' }).then(resp => {
      if (resp?.success) {
        setProgressTiki(resp.data);
      }
      }).catch(err => console.log(err.message))
    }

    if (flag) {
      // Update total item
      adminApi.getStatistics({ type: 'item', platform: 'all' }).then(resp => {
        if (resp?.success) {
          setTotalItem(resp.data.total);
        }
      }).catch(err => console.log(err.message))
    }
  }

  useEffect(() => {
    setTimeout(() => { setUpdateCount(updateCount + 1) }, 15000); // Update after 15s

    fetchCrawlingProgressInfo();

  }, [updateCount]) // eslint-disable-line

  const RenderProgressBarShopee = () => {
      return (<CrawlingProgress
          label='Ti???n ????? crawl s??n Shopee'
          updated={progressShopee.shopee?.updated}
          total={progressShopee.shopee?.total}
          expiredTime={progressShopee.expiredTime}
          executionTimeInMs={progressShopee.shopee?.executionTimeInMs || null}
          /> )
  }

  const RenderProgressBarTiki = () => {
      return (<CrawlingProgress
          label='Ti???n ????? crawl s??n Tiki'
          updated={progressTiki.tiki?.updated}
          total={progressTiki.tiki?.total}
          expiredTime={progressTiki.expiredTime}
          executionTimeInMs={progressTiki.tiki?.executionTimeInMs || null}
          /> )
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle title="H??? th???ng HappyCart" subtitle="T???ng quan" className="text-sm-left mb-3" />
      </Row>
  
      {/* Small Stats Blocks */}
      <Row>
          <Col className="col-lg mb-4" md={6} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='T???ng s??? s???n ph???m crawl ???????c'
              value={totalItem}
              subtitle='t??? c??c s??n'
            />
          </Col>
          <Col className="col-lg mb-4" md={6} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='T???ng danh m???c s???n ph???m'
              value={totalCategory}
              subtitle='c???a c??c s??n'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='S??? l?????ng crawler'
              value={totalCrawler}
              subtitle='??ang tham gia crawl'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='S??? l?????ng ng?????i d??ng'
              value={totalUser}
              subtitle='trong h??? th???ng HappyCart'
            />
          </Col>
          <Col className="col-lg mb-4" md={4} sm={6}>
            <SmallStats
              id={`small-stats-1`}
              variation="1"
              label='T???ng s??? s???n ph???m ???????c theo d??i gi??'
              value={totalTrackedItem}
              subtitle='b???i ng?????i d??ng HappyCart'
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
            handleTimeRangeChange={(start, end) => {setTimeRange({ start, end })}}
          >
          </CrawlingTimeOverview>
        </Col>
  
        {/* Users by Device */}
        <Col lg="4" md="6" sm="12" className="mb-4">
          <CrawledCategory data={crawledCategoryData} limitDisplay={7}/>
        </Col>
      </Row>
    </Container>
  )
}