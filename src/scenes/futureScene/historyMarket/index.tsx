import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Menu, Button, DatePicker } from 'antd-mobile';
import HistoryChart from './historyChart';
import dayjs from 'dayjs';
import NotForecast from '@/components/notForecast';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './index.less';

interface HistoricalRecordProps {
  historyData: any;
  comeFrom: string;
}
interface HistoricalRecordState {
  initData: any;
  show: boolean;
  isChart: boolean;
  iconStyle: boolean;
  date: any;
  iconNum: number;
  visible: boolean;
  realVale: string;
  predictValue: string;
  bt1Value: string;
  bt2Value: string;
  sendParams: {
    coinType: number;
    cycleType: number;
    dateStr: any;
  };
}
type Props = HistoricalRecordProps & DispatchProp & RouteComponentProps;
const data: any = [
  {
    value: 0,
    label: '全部',
  },
  {
    value: 5,
    label: 'BTC',
  },
  {
    value: 6,
    label: 'ETH',
  },
  {
    value: 7,
    label: 'EOS',
    isLeaf: true,
  },
];
const cycleTypeData: any = [
  {
    value: 0,
    label: '全部周期',
  },
  {
    value: 8,
    label: '日',
  },
  {
    value: 9,
    label: '周',
    isLeaf: true,
  },
];
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
class HistoricalRecord extends Component<Props, HistoricalRecordState> {
  constructor(props) {
    super(props);
    this.state = {
      initData: '',
      show: false,
      isChart: false,
      iconStyle: true,
      iconNum: 0,
      date: now,
      visible: false,
      realVale: '0',
      predictValue: '0',
      bt1Value: '全部',
      bt2Value: '全部周期',
      sendParams: {
        coinType: 0,
        cycleType: 0,
        dateStr: '',
      },
    };
  }
  componentWillMount() {
    const a = dayjs(this.state.date).format('YYYY-MM');
    this.setState({ sendParams: { ...this.state.sendParams, dateStr: a } }, () => {
      this.getFetchData(this.state.sendParams);
    });
  }
  onChange = value => {
    let label = '';
    let thisValue: number;
    let thisMapData: any;
    if (this.state.iconNum === 1) {
      thisMapData = data;
    } else if (this.state.iconNum === 2) {
      thisMapData = cycleTypeData;
    }
    thisMapData.forEach(dataItem => {
      if (dataItem.value === value[0]) {
        label = dataItem.label;
        thisValue = dataItem.value;
        // //二级菜单
        // if (dataItem.children && value[1]) {
        //   dataItem.children.forEach(cItem => {
        //     if (cItem.value === value[1]) {
        //       label += ` ${cItem.label}`;
        //     }
        //   });
        // }
        if (this.state.iconNum === 1) {
          this.setState(
            {
              isChart: false,
              show: !this.state.show,
              iconStyle: !this.state.iconStyle,
              iconNum: 0,
              bt1Value: label,
              sendParams: { ...this.state.sendParams, coinType: thisValue },
            },
            () => {
              this.getFetchData(this.state.sendParams);
            },
          );
        } else if (this.state.iconNum === 2) {
          this.setState(
            {
              isChart: false,
              show: !this.state.show,
              iconStyle: !this.state.iconStyle,
              iconNum: 0,
              bt2Value: label,
              sendParams: { ...this.state.sendParams, cycleType: thisValue },
            },
            () => {
              this.getFetchData(this.state.sendParams);
            },
          );
        }
      }
    });
  };
  handleClick = key => {
    let initDatas: any;
    if (key === 3) {
      this.setState({
        iconNum: key,
        visible: !this.state.visible,
        iconStyle: !this.state.iconStyle,
      });
      return;
    } else if (key === 2) initDatas = cycleTypeData;
    else if (key === 1) initDatas = data;
    this.setState({
      show: !this.state.show,
      initData: initDatas,
      iconStyle: !this.state.iconStyle,
      iconNum: key,
    });
  };

  onMaskClick = e => {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: false,
    });
  };
  setChart = () => {
    this.setState({
      isChart: !this.state.isChart,
      realVale: '0',
      predictValue: '0',
    });
  };
  getFetchData = obj => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.historyMarketData(obj, result => {
        if (result.code === 200) {
          return;
        }
      }),
    );
  };
  getFindRouter = obj => {
    this.props.history.push(`/find/topicDetail/${obj}`);
  };
  getHistoryListdata = historythisData => {
    if (historythisData.lenght <= 0) return;
    return historythisData.map((item, index) => {
      return (
        <div
          className="historyList"
          key={index}
          onClick={this.getFindRouter.bind(this, item.marketId)}>
          <div className="listLeft">
            <div className="listleft1">
              <div className="leftTitle">{item.headTitle}</div>
              {/* <p className="time">{`${item.startTime}-${item.endTime}`}</p> */}
            </div>
            <div className="listleft2">
              {/* <div className={item.riseOrFall ? 'leftTitle leftimgup' : 'leftTitle leftimgdown'} /> */}
              <p className="time">{`${item.participateCount}人参与`}</p>
            </div>
          </div>
          <div className="listRight ">
            <span className={item.correctFlag ? 'rightRe trueColor' : 'rightRe falseColor'}>
              {item.correctFlag ? '准确' : '错误'}
            </span>
          </div>
        </div>
      );
    });
  };
  onChartClick = items => {
    //
    this.setState({
      realVale: items[0].value,
      predictValue: items[1].value,
    });
  };
  onOk = date => {
    this.setState(
      {
        date,
        visible: false,
        isChart: false,
        iconStyle: !this.state.iconStyle,
        sendParams: {
          ...this.state.sendParams,
          dateStr: dayjs(date).format('YYYY-MM'),
        },
      },
      () => {
        this.getFetchData(this.state.sendParams);
      },
    );
  };
  onDismiss = () => {
    this.setState({
      visible: false,
      iconStyle: !this.state.iconStyle,
    });
  };
  getIsChart = (thisHeight, historythisData) => {
    if (historythisData.length === 0) {
      return (
        <div style={{ height: `${thisHeight}px`, overflow: 'scroll', background: '#fff' }}>
          <NotForecast title="暂无数据！" titleTwo="" />
        </div>
      );
    } else if (!this.state.isChart) {
      return (
        <div style={{ height: `${thisHeight}px`, overflow: 'scroll', background: '#fff' }}>
          {this.getHistoryListdata(historythisData)}
        </div>
      );
    } else {
      return (
        <div className="chartBody">
          <div className="constractResult">
            <p className="blue">
              真实数据：
              {this.state.realVale}
            </p>
            <p className="pink">
              预测数据：
              {this.state.predictValue}
            </p>
          </div>
          <HistoryChart sourceData={historythisData} onClick={this.onChartClick} />
        </div>
      );
    }
  };

  render() {
    const { initData, show } = this.state;
    const { historyMarketsListData } = this.props.historyData;
    const thisHeight =
      this.props.comeFrom === 'historyMarket'
        ? window.innerHeight - 100 - 107
        : window.innerHeight - 107;
    if (!document.documentElement) return;
    const historythisData =
      !!historyMarketsListData && Object.keys(historyMarketsListData).length !== 0
        ? historyMarketsListData.allList
        : [];
    const marketCount =
      !historyMarketsListData || !historyMarketsListData.marketCount
        ? 0
        : historyMarketsListData.marketCount;
    const precisionRate =
      !historyMarketsListData || !historyMarketsListData.precisionRate
        ? '0%'
        : `${parseFloat((historyMarketsListData.precisionRate * 100).toPrecision(4))}%`;

    const menuEl = (
      <Menu
        className="single-foo-menu"
        data={initData}
        value={['1']}
        level={1}
        onChange={this.onChange}
        height={
          this.state.iconNum === 0 || this.state.iconNum === 1 ? `${45 * 4}px` : `${45 * 3}px`
        }
      />
    );
    return (
      <div
        id="historyPage"
        className={this.props.comeFrom === 'historyMarket' ? 'historyPage' : ''}>
        <Helmet>
          <title>历史记录</title>
        </Helmet>
        <div className={show ? 'single-menu-active' : ''}>
          <div id="historyMenu">
            <Button className="menu1" onClick={this.handleClick.bind(this, 1)}>
              {this.state.bt1Value}
              <i
                className={
                  this.state.iconNum === 1 && !this.state.iconStyle
                    ? 'iconfont icon-triangle_up'
                    : 'iconfont icon-triangle_down'
                }
              />
            </Button>
            <Button className="menu2" onClick={this.handleClick.bind(this, 2)}>
              {this.state.bt2Value}
              <i
                className={
                  this.state.iconNum === 2 && !this.state.iconStyle
                    ? 'iconfont icon-triangle_up'
                    : 'iconfont icon-triangle_down'
                }
              />
            </Button>
            <Button className="menu3" onClick={this.handleClick.bind(this, 3)}>
              {this.state.sendParams.dateStr}
              <i
                className={
                  this.state.iconNum === 3 && !this.state.iconStyle
                    ? 'iconfont icon-triangle_up'
                    : 'iconfont icon-triangle_down'
                }
              />
            </Button>
            <DatePicker
              visible={this.state.visible}
              mode="month"
              value={this.state.date}
              // onChange={date => this.setState({ date, visible: false })}
              onOk={this.onOk}
              // tslint:disable-next-line:jsx-no-lambda
              onDismiss={() =>
                this.setState({
                  visible: false,
                  iconStyle: !this.state.iconStyle,
                })
              }
            />
          </div>
          {show ? menuEl : null}
          <div className="historyDataTop" id="historyDataTop">
            <div className="topLeft">
              共<span>{marketCount}</span>
              场预测，准确率
              <span className="yellowColor">{precisionRate}</span>
            </div>
            {this.state.sendParams.coinType === 0 ||
            this.state.sendParams.cycleType === 0 ? null : (
              <div className="topRight">
                <i
                  className={!this.state.isChart ? 'iconfont icon-chart' : 'iconfont icon-ic_list'}
                  onClick={this.setChart}
                />
              </div>
            )}
          </div>
          {this.getIsChart(thisHeight, historythisData)}
          {/* {!this.state.isChart ? (
            <div style={{ height: `${thisHeight}px`, overflow: 'scroll', background: '#fff' }}>
              {this.getHistoryListdata(historythisData)}
            </div>
          ) : (
            <div className="chartBody">
              <div className="constractResult">
                <p className="blue">
                  真实数据：
                  {this.state.realVale}
                </p>
                <p className="pink">
                  预测数据：
                  {this.state.predictValue}
                </p>
              </div>
              <HistoryChart sourceData={historythisData} onClick={this.onChartClick} />
            </div>
          )} */}

          {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  historyData: store.futureHistoryMarket,
});

export default connect(mapStateToProps)(withRouter(HistoricalRecord));
