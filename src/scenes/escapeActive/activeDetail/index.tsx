import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../redux/actions/fetchTypes';
import DetailTop from './detailTop/detailTop';
import OptionItem from './optionItem/optionItem';
import CommentItem from './commentItem/commentItem';
import './index.less';
import DetailedInput from './detailedInput';
import NotForecast from '../../../components/notForecast';
import NotNetwork from '../../../components/notNetwork';
import Loading from '../../../components/loading';
import LoginAlert from '../../../components/loginAlert/loginAlert';
import { blockedAllAddsImtoken, blockedAdsImtoken } from '../../../config';
import { getNowTimestamp } from '@/utils/time';
import { Flex } from 'antd-mobile';
import { showToast } from '@/utils/common';
let loginState;
let effectiveTime;
let nowTime;
interface TopicDetailProps {
  serverData: any;
  marketId: string;
}
interface TopicDetailState {
  loadingOracle: boolean;
  isImtoken: boolean;
  isHideMessage: boolean;
  banBuy: boolean;
  isShow: boolean;
  isShow1: boolean;
  isShowInput: boolean;
  isPhoenGap: boolean;
  optionId: any;
  showCommentDialog: boolean;
  isCollect: boolean;
  showCopyDialog: number;
}
type Props = TopicDetailProps & RouteComponentProps & DispatchProp;
class TopicDetail extends React.Component<Props, TopicDetailState> {
  judgeHide: any;
  // tslint:disable-next-line:variable-name
  _comText: HTMLDivElement | null;
  constructor(props) {
    super(props);
    this.state = {
      loadingOracle: false,
      isShowInput: false,
      isHideMessage: false,
      banBuy: false,
      isShow: false,
      isShow1: false,
      isImtoken: !!window.imToken,
      isPhoenGap: !!parent.isPhoneGap,
      optionId: null,
      showCommentDialog: false,
      isCollect: false,
      showCopyDialog: 0,
    };

    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  componentWillMount() {
    loginState = localStorage.getItem('loginState');
    effectiveTime = localStorage.getItem('effectiveTime');
    this.props.dispatch({
      type: fetchTypes.INIT_MARKETSDETAIL,
    });
    this.fetcSpecialMarket();
  }

  loginAlert1 = () => {
    if (!loginState || !effectiveTime) {
      this.setState({
        isShow: true,
      });
      return false;
    }
    return this.loginAlert2();
  };

  loginAlert2 = () => {
    nowTime = getNowTimestamp();
    if (effectiveTime - nowTime <= 3) {
      this.setState({
        isShow1: true,
      });

      return false;
    }
    return true;
  };

  hideAlert = () => {
    this.setState({
      isShow: false,
      isShow1: false,
    });
  };

  fetcSpecialMarket = () => {
    const newParams = {
      page: 1,
      per_page: 20,
    };

    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchOracleInfo(this.props.marketId, () => {
        this.setState({
          loadingOracle: false,
        });
      }),
    );
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMarketDetail(this.props.marketId, null, ret => {
        if (ret.code == 200) {
          if (ret.data) {
            sessionStorage.setItem('invested', ret.data.invested);
            sessionStorage.setItem('endTime', ret.data.endTime);
            sessionStorage.setItem('holdOptionId', ret.data.holdOptionId);
            sessionStorage.setItem('commentOptions', JSON.stringify(ret.data.options));
            sessionStorage.setItem('status', ret.data.status);
            const nowTime: any = getNowTimestamp();
            const endTime = ret.data.endTime;
            let time = endTime - nowTime;
            if (ret.data.status == 100) {
              this.setState({
                banBuy: false,
              });
            } else {
              this.setState({
                banBuy: true,
              });
            }
            if (time > 0) {
              setInterval(() => {
                time--;
                if (time < 1) {
                  this.setState({
                    banBuy: true,
                  });
                }
              }, 1000);
            } else {
              this.setState({
                banBuy: true,
              });
            }
            if (ret.data.invested) {
              sessionStorage.setItem('invested', '1');
            } else {
              sessionStorage.setItem('invested', '0');
            }
            sessionStorage.setItem('marketStatus', ret.data.status);
          }
        }
      }),
    );
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchNewCommentList(this.props.marketId, newParams),
    );
  };

  launchComment = () => {
    this.setState({
      isShowInput: true,
    });
  };

  hideBox = () => {
    this.setState({
      isShowInput: false,
    });
  };

  buyMethod = id => {
    this.props.history.push(`/buy/${id}`);
  };

  renderAd = () => {
    const { marketDetailData } = this.props.serverData;
    // const marketDetailData = this.props.serverData;
    if (marketDetailData.partnerLink == null) return null;

    if (this.state.isImtoken) {
      if (blockedAllAddsImtoken) return null;
      for (let i = 0; i < blockedAdsImtoken.length; i++) {
        if (marketDetailData.partnerLink.indexOf(blockedAdsImtoken[i]) != -1) {
          return null;
        }
      }
    }

    return (
      <div
        className="guide"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => {
          if (this.state.isPhoenGap) {
            parent.openLinkInbBrowser(marketDetailData.partnerLink);
          } else {
            window.open(marketDetailData.partnerLink, '_system');
          }
        }}>
        <img src={marketDetailData.partnerImg} alt="" />
      </div>
    );
  };

  goHome = () => {
    this.props.history.push('/');
  };
  // 点击评论
  comment = () => {
    if (this.loginAlert1()) {
      this.setState({
        showCommentDialog: true,
      });
      const marketDetailPage: any = document.getElementById('marketDetailPage');
      marketDetailPage.scrollTop = 0;
      marketDetailPage.style.overflow = 'hidden';
    }
  };
  // 隐藏评论弹窗
  hideComment = () => {
    this.setState({
      showCommentDialog: false,
    });
  };
  //没有分享
  //隐藏复制弹窗
  hideCopyDialog = () => {
    this.setState({ showCopyDialog: 0 });
  };
  //收藏
  collect = marketId => {
    if (this.loginAlert1()) {
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
  //取消收藏
  unCollect = marketId => {
    if (this.loginAlert1()) {
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
  //收藏点击事件
  collectMethod = () => {
    const marketId = this.props.marketId;
    if (this.state.isCollect) {
      this.unCollect(marketId);
    } else {
      this.collect(marketId);
    }
  };

  clickOption = parm => {
    if (parm.data.optionId) {
      this.setState({ optionId: parm.data.optionId });
    }
  };

  render() {
    const toComentList = () => {
      this.props.history.push(`/comment/${marketDetailData.id}?escape=q`);
    };
    const {
      marketDetailData,
      newestList,
      oracleInfo,
      isLoading,
      serverError,
    } = this.props.serverData;
    // tslint:disable-next-line:variable-name
    const _view = () => {
      let rate: any = 0;

      let totalRate = 0;

      if (marketDetailData.options == undefined) {
        return false;
      }
      const optionSelectId = marketDetailData.holdOptionId || this.state.optionId;

      return marketDetailData.options.map((val, index) => {
        if (index == marketDetailData.options.length - 1) {
          rate = 100 - (totalRate - 0);
        } else {
          rate =
            val.numInvestor && val.numInvestor != 0
              ? (((val.numInvestor - 0) / (marketDetailData.numInvestor - 0)) * 100).toFixed(0)
              : 0;
          totalRate = totalRate - 0 + (rate - 0);
        }

        return (
          <OptionItem
            clickOption={this.clickOption}
            totalPerson={marketDetailData.numInvestor}
            holdOptionId={optionSelectId}
            key={index}
            data={val}
            rate={rate}
            buyMethod={this.buyMethod}
            banBuy={this.state.banBuy}
            loginAlert1={this.loginAlert1}
          />
        );
      });
    };

    return (
      <div className="topicDetail" id="marketDetailPage">
        <Helmet>
          <title>详情</title>
        </Helmet>
        {this.state.isShow ? (
          <LoginAlert info="你尚未登录，请登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {this.state.isShow1 ? (
          <LoginAlert info="账号信息过期，请重新登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {serverError ? (
          <NotNetwork />
        ) : (
          <div>
            {isLoading ? (
              <div className="loadingBox">
                <Loading />
              </div>
            ) : (
              <div className="topicDetailBox">
                <DetailTop
                  marketId={this.props.marketId}
                  oracleInfo={oracleInfo}
                  data={marketDetailData}
                  judgeHide={this.judgeHide}
                  isCollect={marketDetailData.subscribed}
                  loginAlert1={this.loginAlert1}
                />
                <div className="selectBox">{_view()}</div>
                {this.renderAd()}
                <DetailedInput
                  holdOptionId={marketDetailData.holdOptionId}
                  id={this.props.marketId}
                  invested={marketDetailData.invested}
                  options={marketDetailData.options}
                  status={1}
                  show={this.state.showCommentDialog}
                  hideCommentDialog={this.hideComment}
                />
                <div
                  className="commentBox"
                  id="commentBox"
                  ref={e => {
                    this._comText = e;
                  }}>
                  <p className="title" id="comText">
                    评论
                  </p>
                  {!this.state.isHideMessage && marketDetailData.options != undefined ? (
                    <div
                      className="commentBtn"
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        this.launchComment();
                      }}
                    />
                  ) : (
                    false
                  )}
                  <div>
                    {newestList != '' ? (
                      <div>
                        {newestList.map((val, index) => {
                          if (index > 3) return null;
                          return (
                            <CommentItem
                              typeId={1}
                              holdOptionId={marketDetailData.holdOptionId}
                              banBuy={this.state.banBuy}
                              key={index}
                              data={val}
                              loginAlert1={this.loginAlert1}
                            />
                          );
                        })}
                        <div
                          className="toLoadMore"
                          // tslint:disable-next-line:jsx-no-lambda
                          onClick={() => {
                            toComentList();
                          }}>
                          <span className="text">查看更多评论</span>
                          <span className="iconMore icon-public_icon_back_normal " />
                        </div>
                      </div>
                    ) : (
                      <div className="noCommentBox">
                        {' '}
                        <NotForecast title="暂无评论！" titleTwo="" />
                      </div>
                    )}
                  </div>
                  {/**详情底部 */}
                  <div className="detailBottom">
                    <Flex className="comment">
                      <div className="icon icon-ic_comments iconfontMarket" />
                      <p onClick={this.comment}>写评论</p>
                    </Flex>
                    <Flex>
                      <div
                        className="activeHome icon-ic_home iconfontMarket"
                        onClick={this.goHome}
                      />
                      {/* <div
                        className={
                          this.state.isCollect
                            ? 'iconfont icon-shoucang font-orange-gradient activeCollect'
                            : 'iconfontMarket icon-me_icon_collect1 activeCollect'
                        }
                        onClick={this.collectMethod}
                      /> */}
                      {/* <div className="share icon-ic_share iconfontMarket" onClick={this.share} /> */}
                    </Flex>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});
export default connect(mapStateToProps)(withRouter(TopicDetail));
