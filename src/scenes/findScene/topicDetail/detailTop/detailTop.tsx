import React from 'react';
import { connect } from 'react-redux';
import './detailTop.less';
import { DispatchProp } from 'react-redux';
import OracleCard from '@/scenes/findScene/detailScene/components/_oracleCard';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { formatTime } from '@/utils/time';
import { Flex } from 'antd-mobile';
interface DetailTopProps {
  serverData: any;
  marketId: number;
  loginAlert1: any;
  data: any;
  showCopyDialog: number;
  hideCopyDialog: any;
  onSelectChange: any;
}
interface DetailTopState {
  expand: boolean;
  loadingOracle: boolean;
  showCopyDialog: number;
  isImtoken: boolean;
}
type Props = DetailTopProps & DispatchProp;
class DetailTop extends React.Component<Props, DetailTopState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      loadingOracle: false,
      showCopyDialog: this.props.showCopyDialog,
      isImtoken: !!window.imToken,
    };
    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      showCopyDialog: nextProps.showCopyDialog,
    });
  }

  getOracle = () => {
    this.setState({ loadingOracle: true });
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchOracleInfo(this.props.marketId, () => {
        this.setState({ loadingOracle: false });
      }),
    );
  };

  changeExpand = () => {
    this.setState({ expand: !this.state.expand });
  };

  componentWillMount() {
    const { oracleInfo, oracleMarketId } = this.props.serverData;
    if (oracleMarketId != this.props.marketId || oracleInfo == 0) {
      this.setState({ loadingOracle: true });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchOracleInfo(this.props.marketId, ret => {
          if (ret.code == 200) {
            this.setState({ loadingOracle: false });
          }
        }),
      );
    }
  }

  ClickWindowCancel = () => {
    // this.setState({ showCopyDialog: 0 });
    this.props.hideCopyDialog();
  };

  render() {
    let marketTagType;
    const { marketDetailData, oracleInfo, oracleMarketId } = this.props.serverData;
    marketTagType = marketDetailData.marketTagType;
    let imgBg;
    let imgBgPartner;
    let thisMarketType;
    let thisMarketDes; // banner 标题view
    let thisMarketTypeClassName;
    const marketId = this.props.marketId;
    if (this.props.data.marketType == 1) {
      thisMarketType = '只赢不输';
      thisMarketTypeClassName = 'winAndNotLose';
      if (this.props.data.nextNumInvestor == -1 && this.props.data.nextReward == -1) {
        thisMarketDes = (
          <div className="itemTopMid">
            <img className="img2" src={require('../../../../img/find/partA.png')} />
            <div className="rightWord">
              <p className="title2">
                总奖池
                {this.props.data.totalReward}
                DPY,当前奖池
                {this.props.data.currentReward}
                DPY,赢者平分
              </p>
              <p className="gray13">
                参与者达到
                {this.props.data.numInvestor}
                人,奖池已达到
                {this.props.data.currentReward}
                DPY
              </p>
            </div>
          </div>
        );
      } else {
        thisMarketDes = (
          <div className="itemTopMid">
            <img className="img2" src={require('../../../../img/find/partA.png')} />
            <div className="rightWord">
              <p className="title2">
                总奖池
                {this.props.data.totalReward}
                DPY,当前奖池
                {this.props.data.currentReward}
                DPY,赢者平分
              </p>
              <p className="gray13">
                <span>
                  再有
                  {this.props.data.nextNumInvestor - this.props.data.numInvestor < 0
                    ? 0
                    : this.props.data.nextNumInvestor - this.props.data.numInvestor}
                  位参与者,
                </span>
                奖池将提升至
                {this.props.data.nextReward}
                DPY
              </p>
            </div>
          </div>
        );
      }
    } else if (this.props.data.marketType == 4) {
      thisMarketTypeClassName = 'winnerTakeAll';
      thisMarketType = '赢者全拿';
      thisMarketDes = (
        <div className="itemTopMid">
          <img
            className="img2 winnertakeallImg"
            src={require('../../../../img/find/winnertakeall.png')}
          />
          <div className="rightWord">
            <p className="title2">
              当前奖池
              {this.props.data.currentReward} DPY
              <i className="allowTop" />
              ,赢者平分
            </p>
            <p className="gray13">
              每个用户的投入都会成为奖池的一部分，
              <br />
              参与越多,奖池越高
            </p>
          </div>
        </div>
      );
    }
    if (this.props.data.image != undefined) {
      if (this.props.data.image.indexOf(',') == -1) {
        imgBg = this.props.data.image;
        imgBgPartner = imgBg; // No choice. Only one image
        // squrieImg = `${this.props.data.image}?imageView2/1/w/100/h/100`;
      } else {
        // More than one image
        const images = this.props.data.image.split(',');
        imgBg = images[0];
        imgBgPartner = images[1];
        // squrieImg = `${images[0]}?imageView2/1/w/100/h/100`;
      }
    }
    //oracle信息及描述部分
    const bottomView = () => {
      const marketDetail = (
        <div>
          {this.state.expand ? (
            <div className="hideArea">
              <OracleCard
                getOracle={this.getOracle}
                loadingOracle={this.state.loadingOracle}
                data={oracleMarketId == marketId ? oracleInfo : false}
                type={marketDetailData.status}
              />
              <div className="desText">{this.props.data.description}</div>
            </div>
          ) : (
            false
          )}
          <div
            className="loadMore"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.changeExpand();
            }}>
            {this.state.expand ? (
              <div className="content">
                <span className="moreText">收起</span>
                <span className="upArrow Open icon-buysale_narrow_more iconfontMarket" />
              </div>
            ) : (
              <div className="content">
                <span className="moreText">展开更多</span>
                <span className="downArrow Open icon-buysale_narrow_more iconfontMarket" />
              </div>
            )}
          </div>
          <div
            style={{
              height: '0.09rem',
              background: 'rgba(245,245,245,1)',
              width: '100%',
            }}
          />
        </div>
      );
      const raiseOrFall = marketDetailData.coinInfoVO
        ? marketDetailData.coinInfoVO.consensusResult
        : -2;
      let trendIcon;
      let trendText;
      let trendColor;
      switch (raiseOrFall) {
        case -1:
          trendIcon = require('@/img/future/future_down.png');
          trendText = '看跌';
          trendColor = 'rgba(255,68,101,1)';
          break;
        case 0:
          trendIcon = require('@/img/future/ic_transverse.png');
          trendText = '横盘';
          trendColor = '#cccccc';
          break;
        case 1:
          trendIcon = require('@/img/future/future_up.png');
          trendText = '看涨';
          trendColor = 'rgba(0,189,154,1)';
          break;
        case -2: //没有人参与或者意见持平
          trendIcon = null;
          trendText = '';
          trendColor = '';
          break;
        default:
          trendIcon = require('@/img/future/ic_transverse.png');
          trendText = '横盘';
          trendColor = '#cccccc';
          break;
      }
      const futureMarketDetail = (
        <div>
          <OracleCard
            getOracle={this.getOracle}
            loadingOracle={this.state.loadingOracle}
            data={oracleMarketId == marketId ? oracleInfo : false}
            type={marketDetailData.status}
            marketTagType={marketTagType}
          />
          <Flex direction="row" className="selectRateView">
            <p>综合</p>
            <div className="rate">
              {/* <p>准确率70%以上</p> */}
              <div className="icon-triangle_down iconfontMarket triangle" />
              <select style={{ background: 'transparent' }} onChange={this.props.onSelectChange}>
                <option value="0">全部</option>
                <option value="60">准确率60%以上</option>
                <option value="70">准确率70%以上</option>
                <option value="80">准确率80%以上</option>
              </select>
            </div>
            <p>的意见</p>
            <div />
            {trendIcon && (
              <Flex className="trend">
                <img src={trendIcon} alt="涨跌" />
                <p style={{ color: trendColor }}>{trendText}</p>
              </Flex>
            )}
          </Flex>
          <Flex align="start" justify="end" direction="column" className="joinNumView">
            <p>
              共汇集了
              {marketDetailData.totalParticipators}
              位用户意见
            </p>
          </Flex>
        </div>
      );
      return marketTagType === 1 ? (
        <div>{futureMarketDetail}</div>
      ) : (
        <div>
          {thisMarketDes}
          <div className="line" />
          {marketDetail}
        </div>
      );
    };
    const topicItemBg = marketTagType === 1 ? 'futureBackground' : 'normalBackground';
    return (
      <div className="topicBoxDetail">
        <div className="detailTop">
          {this.props.data != '' ? (
            <div>
              <div className={'topicItem ' + topicItemBg}>
                <div className="itemTop">
                  <div className="itemTopBox">
                    <img className="topicBgImg" src={this.state.isImtoken ? imgBg : imgBgPartner} />
                    <div className="wraperBox">
                      <div className="topicImgMidTitle">
                        <span className={thisMarketTypeClassName}>{thisMarketType}</span>
                        {this.props.data.title}
                      </div>
                      <div className="topicImgBom">
                        <div className="left">
                          <span>
                            截止：
                            {formatTime(this.props.data.endTime)}
                          </span>
                        </div>
                        <div className="right">
                          <i className="img2 iconfontMarket icon-ic_people" />
                          <span>{this.props.data.numInvestor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.showCopyDialog ? (
                  <div className="clickWindow" id="inviteMethodClickWindow">
                    <div className="clickWindowCover" onClick={this.ClickWindowCancel} />
                    <div className="clickWindowIn">
                      <p>邀请链接已复制到粘贴板，请直接发送给您的好友</p>
                      <p className="lineNotMar" />
                      <p onClick={this.ClickWindowCancel}>确定</p>
                    </div>
                  </div>
                ) : (
                  false
                )}
                {/* {thisMarketDes} */}
                {bottomView()}
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({ serverData: store.marketDetailState });

export default connect(mapStateToProps)(DetailTop);
