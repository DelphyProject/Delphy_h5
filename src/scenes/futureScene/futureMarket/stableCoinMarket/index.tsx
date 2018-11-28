import React from 'react';
// import ReactDOM from 'react-dom';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { Accordion, Progress } from 'antd-mobile';
// import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './index.less';
// import { cancelRequest } from '@/utils/request';
interface StableCoinMarketProps {
  serverData: any;
  upPull: any;
  // isLoading: any;
}
interface StableCoinMarketState {
  // refreshing: boolean;
  down: boolean;
  height: any;
  winHight: number;
}
type Props = StableCoinMarketProps & DispatchProp & RouteComponentProps;
// let pageNum = 2;
class StableCoinMarket extends React.Component<Props, StableCoinMarketState> {
  ptr: any;
  constructor(props) {
    super(props);
    const thisDocument: any = document.documentElement;
    this.state = {
      // refreshing: false,
      down: false,
      height: thisDocument.clientHeight,
      winHight: 0,
    };
  }
  componentDidMount() {
    // const winhig = window.innerHeight;
    // const thisDom: any = ReactDOM.findDOMNode(this.ptr);
    // // eslint-disable-next-line
    // const hei = this.state.height - thisDom.offsetTop - 50;
    // this.setState({
    //   height: hei,
    //   winHight: winhig,
    // });
  }
  toMarketDetail = id => {
    //
    this.props.history.push(`/find/topicDetail/${id}`);
  };
  upPull = () => {
    // const params = {
    //   page: pageNum,
    //   per_page: 10,
    // };
    // this.setState({ refreshing: true });
    // cancelRequest();
    // this.props.dispatch(
    //   //@ts-ignore
    //   fetchData.getStableCoinList(params, result => {
    //     this.setState({
    //       refreshing: false,
    //     });
    //     if (result.data.length > 0) {
    //       pageNum++;
    //     }
    //   }),
    // );
  };
  onChange = () => {
    // this.setState({
    //   hideLine: true,
    // });
    //
  };
  render() {
    const data = this.props.serverData.stableList;
    //单个手风瑟的header
    const panelHeader = (item, hideLine) => {
      const raiseOrFall = item.consensusResult;
      let trendIcon;
      switch (raiseOrFall) {
        case -1:
          trendIcon = require('@/img/future/future_down.png');
          break;
        case 0:
          trendIcon = require('@/img/future/ic_transverse.png');
          break;
        case 1:
          trendIcon = require('@/img/future/future_up.png');
          break;
        case -2:
          trendIcon = null;
          break;
        default:
          trendIcon = require('@/img/future/future_up.png');
          break;
      }
      return (
        <div className="panelHeaderBox">
          <div className="dividerLine" />
          <div className="panelHeader">
            <p className="title">{item.marketName}</p>
            <div className="itemRight">
              {trendIcon && <img className="upordown" src={trendIcon} />}
              <p className="joinNum">
                已有
                {item.joinNum}
                人贡献认知
              </p>
            </div>
          </div>
          {/* {!hideLine ? <div className="dividerLine" /> : null} */}
        </div>
      );
    };
    //所有item的手风瑟view
    const panelView = markets => {
      return markets.map((item, index) => {
        return (
          <Accordion.Panel header={panelHeader(item, index === markets.length - 1)} key={index}>
            <div className="listContent">
              <div className="listContentTitle">
                <p className="title">{item.marketTitle}</p>
                <div className="lookup">
                  <p onClick={this.toMarketDetail.bind(this, item.marketId)}>查看</p>
                  <img className="upordown" src={require('@/img/arrow-right.png')} />
                </div>
              </div>
              {item.options.map((market, index) => {
                const rate = Number(market.rate.replace('%', ''));
                let pBorderColor;
                if (rate <= 25) {
                  pBorderColor = '#FF4465';
                } else if (rate > 25 && rate <= 50) {
                  pBorderColor = '#FDD338';
                } else if (rate > 50 && rate <= 75) {
                  pBorderColor = '#91DEE5';
                } else if (rate > 75) {
                  pBorderColor = '#70C7E9';
                }
                const str = 'A';
                const word = String.fromCharCode(str.charCodeAt(0) + index);
                return (
                  <div
                    key={index}
                    className={
                      index % 2 == 0 ? 'listContentItemBox bgSingle' : 'listContentItemBox bgDouble'
                    }>
                    <div className="listContentItem">
                      <div className="listContentItemLeft">
                        <p className="num">{word}</p>
                        <p className="title">{market.optionsTitle}</p>
                      </div>
                      <p className="percent">{market.rate}</p>
                    </div>
                    <Progress
                      percent={rate}
                      position="normal"
                      barStyle={{ borderColor: pBorderColor }}
                    />
                  </div>
                );
              })}
            </div>
          </Accordion.Panel>
        );
      });
    };
    //所有view
    const contentView = data.map((item, index) => {
      let content;
      let avatarSrc;
      let riseOrFall;
      if (!item.riseOrFall) {
        content = 'contentGray';
        riseOrFall = '--';
      } else if (item.riseOrFall.indexOf('-') !== -1) {
        content = 'contentRed';
        riseOrFall = item.riseOrFall;
      } else {
        content = 'contentGreen';
        riseOrFall = '+' + item.riseOrFall;
      }
      switch (item.coinId) {
        case 5:
          avatarSrc = require('@/img/future/btc.png');
          break;
        case 6:
          avatarSrc = require('@/img/future/eth.png');
          break;
        case 7:
          avatarSrc = require('@/img/future/eos.png');
          break;
      }
      return (
        <div className="stableCoinCard" key={index}>
          <div className="coinCardTitle">
            <img className="coinCardTitleIcon" src={avatarSrc} />
            <div className="coinCardTitleRight">
              <div className="coinCardTitleItem">
                <p className="content">{item.coinName}</p>
                <p className="tip">
                  当前价格$
                  {item.currentPrice}
                </p>
              </div>
              <div className="coinCardTitleItem">
                <p className="content">{item.accuracyRate}</p>
                <p className="tip">币种历史准确率</p>
              </div>
              <div className="coinCardTitleItemRight">
                <p className={content}>{riseOrFall}</p>
                <p className="tip">本日涨跌幅</p>
              </div>
            </div>
          </div>
          <Accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
            {panelView(item.iconMarkets)}
          </Accordion>
        </div>
      );
    });
    return (
      <div className="stablePage">
        {/* <PullToRefresh
          damping={60}
          ref={el => {
            this.ptr = el;
          }}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={false}
          distanceToRefresh={25}> */}
        {contentView}
        {/* </PullToRefresh> */}
      </div>
    );
  }
}
const mapStateToProps = store => ({ serverData: store.futureMarket });
export default connect(mapStateToProps)(withRouter(StableCoinMarket));
