import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import Bt from '@/components/button';
import './style.less';
import AlertBox from '@/scenes/findScene/detailScene/components/_alertBox';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

import webViewApi from '@/webViewerApi';
import { formatTime, getNowTimestamp } from '@/utils/time';

const MARKET_ONGOING = 1;
const MARKET_WAITING_SETTLED = 2;
const MARKET_COMPLETED = 3;
const MARKET_APPEALING = 4;
const MARKET_COMMUTED = 5;
interface FixFooterProps {
  data: any;
  marketId: number;
  serverData: any;
  invested: boolean;
  rightOption: any;
  type: number;
}
interface FixFooterState {
  typeID: any;
  isShow: boolean;
  isHidden: boolean;
  isSellHidden: boolean;
  isCollected: boolean;
  isHold: boolean;
  isPhoneGap: boolean;
  outOfDate: boolean;
}
type Props = FixFooterProps & RouteComponentProps & DispatchProp;
class FixFooter extends React.Component<Props, FixFooterState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isHidden: false,
      isSellHidden: false,
      typeID: null,
      isCollected: true, // 模拟
      isHold: false,
      isPhoneGap: !!parent.isPhoneGap,
      outOfDate: false,
    };
  }

  componentWillMount() {
    let holdShares = 0;
    if (this.props.data) {
      this.props.data.map((val, index) => {
        holdShares += val.holdShares - 0;
      });
    }

    if (holdShares > 0) {
      this.setState({
        isHold: true,
      });
    }
  }

  changeStatus = bool => {
    this.setState({
      isHidden: !bool,
    });
  };

  changeSellStatus = bool => {
    this.setState({
      isHidden: !bool,
    });
  };

  _collect() {
    if (localStorage.getItem('loginState') != '1') {
      showToast('请登录', 2);
      return;
    }
    const nowTime = getNowTimestamp();
    const effectiveTime: any = localStorage.getItem('effectiveTime');
    if (effectiveTime - nowTime <= 3) {
      showToast('账号信息过期，请重新登录', 2);
      return;
    }
    this.props.dispatch(
      //@ts-ignore
      fetchData.collect(this.props.marketId, result => {
        if (result.code == 200) {
          showToast('收藏成功', 2);
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  _unCollect() {
    if (localStorage.getItem('loginState') != '1') {
      showToast('请登录', 2);
      return;
    }
    const nowTime = getNowTimestamp();
    const effectiveTime: any = localStorage.getItem('effectiveTime');
    if (effectiveTime - nowTime <= 3) {
      showToast('账号信息过期，请重新登录', 2);
      return;
    }
    this.props.dispatch(
      //@ts-ignore
      fetchData.unCollect(this.props.marketId, result => {
        if (result.code == 200) {
          showToast('取消收藏', 2);
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  OnGoingType = () => {
    // tslint:disable-next-line:variable-name
    const font_collect = {
      color: '#ffaf52',
    };
    // tslint:disable-next-line:variable-name
    const font_uncollect = {
      color: '#8893a4',
    };
    const { marketDetailData } = this.props.serverData;
    //    let marketData=marketDetailData.markets?marketDetailData.markets[0]:{}

    const fonstyle = marketDetailData.subscribed ? font_collect : font_uncollect;
    return (
      <div id="fix-footer">
        <AlertBox
          data={marketDetailData}
          marketId={this.props.marketId}
          typeID={this.state.typeID}
          callback={this.changeStatus}
          isHidden={this.state.isHidden}
        />
        {/* <AlertSellBox data={this.props.data}  callback={this.changeSellStatus} isSellHidden={this.state.isSellHidden} /> */}
        <div
          className="text12We fixFooterIco"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            marketDetailData.subscribed ? this._unCollect() : this._collect();
          }}>
          <span style={fonstyle} className="icon-details_icon_collect_normal ico" />
          收藏
        </div>
        <div
          className="text12We ml-12 fixFooterIco fixFooterIcoTwo"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (window.delphy) {
              window.delphy.share(
                '天算-有趣的预测市场平台',
                `邀请您参加预测话题："${marketDetailData.title}"`,
                window.location.href,
              );
            } else if (this.state.isPhoneGap) {
              parent.share(
                '天算-有趣的预测市场平台',
                `邀请您参加预测话题："${marketDetailData.title}"`,
                window.location.href,
              );
            } else {
              // webViewApi.share(marketDetailData.title, '', null)
              webViewApi.share('', `邀请您参加预测话题："${marketDetailData.title}",链接：`, null);
            }
          }}>
          <span className="icon-details_icon_share_normal ico" />
          分享
        </div>

        {/* <div className="ml-12 fixFooterBtn" onClick={() => {
                    if (!this.state.isHold) {
                        return
                    }
                    if (localStorage.getItem('loginState') != 1) {
                        showToast('请登录', 2)
                        return
                    }
                    var nowTime = Date.parse(new Date()) / 1000
                    var effectiveTime = localStorage.getItem('effectiveTime')
                    if (effectiveTime - nowTime <= 3) {
                        showToast('账号信息过期，请重新登录', 2)
                        return
                    }
                    this.setState({
                        typeID: 1,
                        isHidden: !this.state.isHidden
                    })
                }} >
                    <Bt color={this.state.isHold ? "red" : "gray"} text="卖出" />
                </div> */}

        <div
          className="fixFooterBtn"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            let isLogin: any = false;
            const loginState = localStorage.getItem('loginState');
            const nowTime: any = getNowTimestamp;
            const effectiveTime: any = localStorage.getItem('effectiveTime');
            if (effectiveTime) {
              isLogin = loginState == '1' && effectiveTime - 0 - nowTime > 3;
              // if (effectiveTime - nowTime <= 3) {
              //     this.setState({
              //         outOfDate: true,
              //         isShow:true
              //     })
              //     showToast('账号信息过期，请重新登录', 2)
              //     return
              // }
            } else {
              isLogin = loginState;
            }
            if (!isLogin) {
              this.setState({
                // outOfDate: true,
                isShow: true,
              });
              if (effectiveTime - nowTime <= 3) {
                this.setState({
                  outOfDate: true,
                });
                // showToast('账号信息过期，请重新登录', 2)
                // return
              } else {
                this.setState({
                  outOfDate: false,
                });
              }
              return;
            }
            this.setState({
              typeID: 0,
              isHidden: !this.state.isHidden,
            });
          }}>
          <Bt text="买入" color={''} />
        </div>
        {this.state.isShow ? (
          <div className="marketPromptLogingPage">
            <div
              className="marketPromptLogingCover"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  isShow: false,
                });
              }}
            />
            <div className="marketPromptLoging">
              <p>{this.state.outOfDate ? '您还未登录' : '账号已过期'}</p>
              <div className="lineNotMar" />
              <pre
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.push('/login');
                }}>
                确定
              </pre>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  };

  WaitingSettled = (info, buttonText, url, rightOption, numInvestor) =>
    rightOption != '' ? (
      <div id="fix-footer" className="DetailedPage">
        <div>
          {info.map((item, key) => (
            <div key={key} className="text12 content_black text_bottom">
              {item}
            </div>
          ))}
        </div>
        <div className="Detailed">
          {/* <Bt text={buttonText} url={url} /> */}
          {/* <Link to={url} > */}
          <div
            className="bt"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              if (localStorage.getItem('loginState') != '1') {
                showToast('请登录', 2);
                return;
              }
              const nowTime = getNowTimestamp();
              const effectiveTime: any = localStorage.getItem('effectiveTime');
              if (effectiveTime - nowTime <= 3) {
                showToast('账号信息过期，请重新登录', 2);
                return;
              }
              if (!this.props.invested) {
                showToast('您未参与该市场', 2);
                return;
              }
              this.props.history.push(url);
            }}>
            <div className="voilet">{buttonText}</div>
          </div>
          {/* </Link> */}
        </div>
      </div>
    ) : (
      <div id="fix-footer" className="DetailedPage">
        <p className="numInvestor">
          交易已关闭，共
          {numInvestor}
          人参与，请等待结果验证
        </p>
      </div>
    );

  render() {
    const { marketDetailData } = this.props.serverData;
    const rightOption = this.props.rightOption;
    let currentCard;
    const waitingSettledData = {
      info: [
        `当前市场结束时间：${formatTime(marketDetailData.endTime, 'MM月DD日 HH:mm')}`,
        `预计奖金到账时间：${formatTime(marketDetailData.objectionTime, 'MM月DD日 HH:mm')}`,
      ],
      buttonText: '申诉',
      url: `/market/${this.props.marketId}/appeal`,
    };
    const appealingData = {
      info: ['当前市场正接受申诉 请等待申诉结果'],
      buttonText: '申诉',
      url: `/market/${this.props.marketId}/appeal`,
    };
    const commuteData = {
      info: [
        '完成申诉处理，进入公示期',
        `预计奖金到账时间：${formatTime(marketDetailData.objectionTime, 'MM月DD日 HH:mm')}`,
      ],
      buttonText: '申诉',
      url: `/market/${this.props.marketId}/appeal`,
    };
    const completedData = {
      info: ['当前预市场已完成结果确认'],
      buttonText: '明细',
      url: `/market/${this.props.marketId}/marketTxRecord`,
    };

    switch (this.props.type) {
      case MARKET_ONGOING:
        // if (marketDetailData) {
        //    sessionStorage.setItem('marketDetail',JSON.stringify(marketDetailData))
        // }
        currentCard = this.OnGoingType();
        // currentCard = this.WaitingSettled(completedData.info, completedData.buttonText, completedData.url);
        // currentCard = this.WaitingSettled(waitingSettledData.info, waitingSettledData.buttonText, waitingSettledData.url);
        // currentCard = this.WaitingSettled(completedData.info, completedData.buttonText, completedData.url);
        break;
      case MARKET_WAITING_SETTLED:
        currentCard = this.WaitingSettled(
          waitingSettledData.info,
          waitingSettledData.buttonText,
          waitingSettledData.url,
          rightOption,
          marketDetailData.numInvestor,
        );
        break;
      case MARKET_APPEALING:
        currentCard = this.WaitingSettled(
          appealingData.info,
          appealingData.buttonText,
          appealingData.url,
          rightOption,
          marketDetailData.numInvestor,
        );
        break;
      case MARKET_COMMUTED:
        currentCard = this.WaitingSettled(
          commuteData.info,
          commuteData.buttonText,
          commuteData.url,
          rightOption,
          marketDetailData.numInvestor,
        );
        break;
      case MARKET_COMPLETED:
        if (marketDetailData) {
          sessionStorage.setItem('marketDetail', JSON.stringify(marketDetailData));
        }
        currentCard = this.WaitingSettled(
          completedData.info,
          completedData.buttonText,
          completedData.url,
          rightOption,
          marketDetailData.numInvestor,
        );
        break;
    }

    return <div>{currentCard}</div>;
  }
}

const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});
export default connect(mapStateToProps)(withRouter(FixFooter));
