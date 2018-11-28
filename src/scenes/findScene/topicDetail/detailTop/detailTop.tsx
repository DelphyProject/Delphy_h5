import React from 'react';
import { showToast } from '@/utils/common';
import { connect } from 'react-redux';
import Copy from 'copy-to-clipboard';

import './detailTop.less';
import { delphyUrl } from '@/config';
import { DispatchProp } from 'react-redux';
import OracleCard from '@/scenes/findScene/detailScene/components/_oracleCard';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import webViewApi from '@/webViewerApi';
import { formatTime } from '@/utils/time';
interface DetailTopProps {
  isCollect: boolean;
  serverData: any;
  marketId: number;
  loginAlert1: any;
  data: any;
}
interface DetailTopState {
  expand: boolean;
  loadingOracle: boolean;
  isCollect: boolean;
  ClickWindowState: number;
  isImtoken: boolean;
  isPhoneGap: boolean;
}
type Props = DetailTopProps & DispatchProp;
class DetailTop extends React.Component<Props, DetailTopState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      loadingOracle: false,
      isCollect: this.props.isCollect,
      ClickWindowState: 0,
      isImtoken: !!window.imToken,
      isPhoneGap: parent.isPhoneGap,
    };
    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
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

  collect = (e, marketId) => {
    if (this.props.loginAlert1()) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.collect(marketId, result => {
          if (result.code == 200) {
            showToast('收藏成功', 2);
            this.setState({ isCollect: true });
            this.props.dispatch({
              type: fetchTypes.UPDATE_FIND_COLLECT,
              data: true,
              id: marketId,
            });
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
    }
  };

  unCollect = (e, marketId) => {
    if (this.props.loginAlert1()) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.unCollect(marketId, result => {
          if (result.code == 200) {
            showToast('取消收藏', 2);
            this.setState({ isCollect: false });
            this.props.dispatch({
              type: fetchTypes.UPDATE_FIND_COLLECT,
              data: false,
              id: marketId,
            });
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
    }
  };

  collectMethod = (e, marketID) => {
    if (this.state.isCollect) {
      this.unCollect(e, marketID);
    } else {
      this.collect(e, marketID);
    }
  };

  ClickWindowCancel = () => {
    this.setState({ ClickWindowState: 0 });
  };

  render() {
    const { marketDetailData, oracleInfo, oracleMarketId } = this.props.serverData;
    let imgBg;
    let imgBgPartner;
    let squrieImg;
    let thisMarketType;
    let thisMarketDes;
    let thisMarketTypeClassName;
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
            {this.props.data.status == 100 ? (
              <button
                type="button"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  inviteMethod();
                }}>
                邀请
              </button>
            ) : (
              false
            )}
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
            {this.props.data.status == 100 ? (
              // tslint:disable-next-line:jsx-no-lambda
              <button type="button" onClick={() => inviteMethod()}>
                邀请
              </button>
            ) : (
              false
            )}
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
          {this.props.data.status == 100 ? (
            // tslint:disable-next-line:jsx-no-lambda
            <button type="button" onClick={() => inviteMethod()}>
              邀请
            </button>
          ) : (
            false
          )}
        </div>
      );
    }
    if (this.props.data.image != undefined) {
      if (this.props.data.image.indexOf(',') == -1) {
        imgBg = this.props.data.image;
        imgBgPartner = imgBg; // No choice. Only one image
        squrieImg = `${this.props.data.image}?imageView2/1/w/100/h/100`;
      } else {
        // More than one image
        const images = this.props.data.image.split(',');
        imgBg = images[0];
        imgBgPartner = images[1];
        squrieImg = `${images[0]}?imageView2/1/w/100/h/100`;
      }
    }
    const marketId = this.props.marketId;
    const platform = localStorage.getItem('platform');
    const inviteMethod = () => {
      if (window.delphy) {
        // window.delphy.share('天算，只赢不输的预测市场', '邀请您参加预测话题："' + marketDetailData.title + '链接：', delphyUrl + "find/topicDetail/" + marketId, squrieImg)
        window.delphy.share(
          marketDetailData.title,
          marketDetailData.description,
          `${delphyUrl}find/topicDetail/${marketId}`,
          squrieImg,
        );
      } else if (this.state.isPhoneGap) {
        parent.umShare(
          marketDetailData.title,
          marketDetailData.description,
          `${delphyUrl}find/topicDetail/${marketId}`,
          squrieImg,
        );
      } else if (platform == 'imtoken') {
        webViewApi.share('', `邀请您参加预测话题："${marketDetailData.title}",链接：`, null);
      } else {
        Copy(`邀请您参加预测话题："${marketDetailData.title}",链接：${window.location.href}`);
        this.setState({ ClickWindowState: 1 });
      }
    };

    return (
      <div className="topicBoxDetail">
        <div className="detailTop">
          {this.props.data != '' ? (
            <div>
              <div className="topicItem">
                <div className="itemTop">
                  <div className="itemTopBox">
                    <img className="topicBgImg" src={this.state.isImtoken ? imgBg : imgBgPartner} />
                    <div className="wraperBox">
                      <div
                        className="favotate"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={e => {
                          this.collectMethod(e, this.props.data.id);
                        }}>
                        <div>
                          {this.state.isCollect ? (
                            <i className="iconfont icon-shoucang font-orange-gradient" />
                          ) : (
                            <i className="iconfont icon-shoucang font-ccc" />
                          )}
                        </div>
                      </div>
                      <div className="topicImgMidTitle">
                        <span className={thisMarketTypeClassName}>{thisMarketType}</span>
                        {this.props.data.title}
                      </div>
                      <div className="topicImgBom">
                        <div className="left">
                          <i className="img1 iconfontMarket icon-Group4" />
                          <span>{formatTime(this.props.data.endTime)}</span>
                        </div>
                        <div className="right">
                          <i className="img2 iconfontMarket icon-Adeltails_amoun" />
                          <span>{this.props.data.numInvestor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.ClickWindowState ? (
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
                {thisMarketDes}
                <div className="line" />

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
                      <span className="text1">收起</span>
                      <span className="upArrow Open icon-Bxiangqingzhankaix iconfontMarket" />
                    </div>
                  ) : (
                    <div className="content">
                      <span className="text1">展开更多</span>
                      <span className="downArrow Open icon-Bxiangqingzhankaix iconfontMarket" />
                    </div>
                  )}
                </div>
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
