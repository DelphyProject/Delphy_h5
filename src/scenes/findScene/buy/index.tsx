import React from 'react';
import { Slider } from 'antd-mobile';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import './index.less';
import BuyResultDialog from '@/scenes/findScene/buy/_buyTipDialog/buyTipDialog';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import NotForecast from '@/components/notForecast';
import NotNetwork from '@/components/notNetwork';
import Loading from '@/components/loading';
import { formatTime } from '@/utils/time';
interface BuyProps {
  optionId: number;
  amount: number;
  serverData: any;
}
interface BuyState {
  hidden: boolean;
  info: string;
  balance: number;
  dummyBalance: number;
  slideWidth: string;
  amount: number;
  costDpy: number;
  canNum: number;
}
type Props = BuyProps & DispatchProp & RouteComponentProps;
class Buy extends React.Component<Props, BuyState> {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      info: '当前交易拥堵，请重试',
      balance: 0,
      dummyBalance: 0,
      amount: 1,
      costDpy: 2,
      canNum: 0,
      slideWidth: '0%',
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: fetchTypes.CLEAR_BUY_DATA,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.loadBuyPage(this.props.optionId, result => {
        if (result.code == 200) {
          const dpyNum = Math.floor((result.data.balance + result.data.dummyBalance) / 2);
          if (dpyNum < result.data.surplusShares) {
            this.setState({
              canNum: dpyNum,
            });
          } else {
            this.setState({
              canNum: result.data.surplusShares,
            });
          }
          this.setState({
            balance: Number(result.data.balance.toFixed(2)),
            dummyBalance: Number(result.data.dummyBalance.toFixed(2)),
            slideWidth: `${(this.state.canNum / result.data.userMaxBuyCount) * 100}%`,
          });
        }
      }),
    );
  }

  buy = () => {
    showLoading('交易中');
    const params = {
      optionId: this.props.optionId,
      amount: this.state.amount,
      limit: 10,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.buy(params, result => {
        if (result.code == 200) {
          hideLoading();
          this.setState({
            hidden: true,
          });
          sessionStorage.setItem('transactionInfo', JSON.stringify(result.data));
          this.props.history.push('/find/success');
        } else {
          hideLoading();
          this.setState({
            hidden: false,
            info: result.msg,
          });
        }
      }),
    );
  };

  onConfirm = () => {
    this.setState({ hidden: true });
  };

  recharge = () => {
    const { goodsBuyInfo } = this.props.serverData;
    sessionStorage.setItem('address', goodsBuyInfo.address);
    this.props.history.push('/me/balance');
  };

  renderTotalCost = (obj, obj1) => {
    const totalCost = this.state.amount * 2;
    const balance = Number(this.state.balance);
    const dummyBalance = Number(this.state.dummyBalance);
    if (obj && obj == 4) {
      const winnerTakeAllTotalCost = this.state.amount * obj1;
      return `${winnerTakeAllTotalCost.toFixed(2)} DPY`;
    }
    if (totalCost > balance + dummyBalance) {
      // Balance not enough
      return `${totalCost.toFixed(2)} DPY`;
    }

    if (totalCost > dummyBalance) {
      // Must use real coin
      if (dummyBalance == 0) {
        // All real coin
        return `${totalCost.toFixed(2)} DPY`;
      }
      // Mixed
      return `${(totalCost - dummyBalance).toFixed(2)} DPY + ${dummyBalance.toFixed(2)}  预测币`;
    }
    // Dummy coin is sufficient
    return `${totalCost.toFixed(2)} 预测币`;
  };

  render() {
    const { goodsBuyInfo, serverError, isLoading } = this.props.serverData;
    let endTime;
    let numInvestor;
    let option;
    let title;
    let currentReward;
    let thisBalance;
    if (goodsBuyInfo != null) {
      if (goodsBuyInfo.marketType == 4) {
        thisBalance = (
          <div className="balance">
            <span className="name">可用余额：</span>
            <span className="money">{this.state.balance} DPY</span>
            <span className="amountRowRight">
              <button
                type="button"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.recharge();
                }}>
                充值
              </button>
            </span>
          </div>
        );
      } else {
        thisBalance = (
          <div className="balance">
            <div>
              <span className="name">可用余额：</span>
            </div>
            <div className="amountRow">
              <span className="amountRowLeft">
                <span className="money">{this.state.balance} DPY</span>
                <span className="money">{this.state.dummyBalance} 预测币</span>
              </span>
              <span className="amountRowRight">
                <button
                  type="button"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.recharge();
                  }}>
                  充值
                </button>
              </span>
            </div>
          </div>
        );
      }
      endTime = formatTime(goodsBuyInfo.endTime, 'YYYY.MM.DD HH:mm');
      numInvestor = goodsBuyInfo.numInvestor;
      option = goodsBuyInfo.option;
      title = goodsBuyInfo.title;
      currentReward = goodsBuyInfo.currentReward;
    }
    return (
      <div className="buyPage">
        <Helmet>
          <title>支持</title>
        </Helmet>
        {serverError ? (
          <NotNetwork />
        ) : (
          <div>
            {isLoading ? (
              <div className="loadingBox">
                <Loading />
              </div>
            ) : (
              <div>
                {goodsBuyInfo != null ? (
                  <div className="mainPage">
                    <div className="buyTop">
                      <div className="title">{title}</div>
                      <div className="topBom">
                        <span className="leftItem">
                          <span>截止时间：</span>
                          <span>{endTime}</span>
                        </span>
                        <span className="RightItem">
                          <span>参与人数：</span>
                          <span>{numInvestor}</span>
                        </span>
                      </div>
                    </div>
                    <div className="buyMid">
                      <div className="midItem">
                        <span>选项</span>
                        <span>{option.title}</span>
                      </div>
                      <div className="midItem">
                        <span>当前价格</span>
                        <span>{goodsBuyInfo.price} DPY</span>
                      </div>
                      <div className="midItem">
                        <span>已持有份数</span>
                        <span>{goodsBuyInfo.userMaxBuyCount - goodsBuyInfo.surplusShares}份</span>
                      </div>
                    </div>
                    {thisBalance}
                    <div className="buySlider">
                      <div className="buySliderBox">
                        <div className="buyText">
                          <div className="textItem">
                            <p>{this.state.amount}</p>
                            <p>份数</p>
                          </div>
                          <div className="textItem">
                            <p>
                              {this.renderTotalCost(
                                goodsBuyInfo.marketType,
                                Number(goodsBuyInfo.price),
                              )}
                            </p>
                            <p>总价</p>
                          </div>
                        </div>
                        <div className="sliderBox">
                          <div className="sliderIn">
                            <Slider
                              style={{
                                marginLeft: 10,
                                marginRight: 10,
                                borderRaduis: 1,
                                width: this.state.slideWidth,
                              }}
                              defaultValue={1}
                              min={1}
                              max={this.state.canNum}
                              trackStyle={{
                                backgroundColor: '#FF9266  ',
                                height: '0.1rem',
                              }}
                              railStyle={{
                                backgroundColor: '#E0E0E0 ',
                                height: '0.1rem',
                              }}
                              handleStyle={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: '#FC7854',
                                border: 'none',
                                opacity: 0.9,
                                top: -1,
                              }}
                              // tslint:disable-next-line:jsx-no-lambda
                              onChange={value => {
                                if (goodsBuyInfo.userMaxBuyCount == 0) {
                                  this.setState({
                                    amount: value,
                                    costDpy: value * 2,
                                  });
                                } else {
                                  if (
                                    goodsBuyInfo.surplusShares != undefined &&
                                    goodsBuyInfo.surplusShares != 0
                                  ) {
                                    if (value > this.state.canNum || value == this.state.canNum) {
                                      showToast(
                                        `单个话题最多持有${
                                          goodsBuyInfo.userMaxBuyCount
                                        }份,您已持有${goodsBuyInfo.userMaxBuyCount -
                                          goodsBuyInfo.surplusShares}份，此次最多再持有${
                                          this.state.canNum
                                        }份`,
                                        2,
                                      );
                                    }
                                  } else {
                                    showToast(
                                      `单个话题最多持有${
                                        goodsBuyInfo.userMaxBuyCount
                                      }份,此话题您已到持有上限，去看看其他话题吧！`,
                                      2,
                                    );
                                  }
                                  this.setState({
                                    amount: value,
                                    costDpy: value * 2,
                                  });
                                }
                              }}
                            />
                            <div className="bgBar" />
                          </div>
                        </div>
                        <div className="numBom">
                          <span>1</span>
                          <span>10</span>
                        </div>
                        {goodsBuyInfo.userMaxBuyCount != 0 ? (
                          <div className="bomNum">
                            注意 : 单个话题最多累积持有 {goodsBuyInfo.userMaxBuyCount} 份
                          </div>
                        ) : (
                          false
                        )}
                      </div>
                    </div>

                    <div className="buyBom">
                      {goodsBuyInfo.marketType == 4 ? (
                        <p>
                          在赢者全拿模式下，您的投入将被注入奖池。若您预测成功，将平分奖池，当前奖池
                          <span>{currentReward} DPY</span>
                        </p>
                      ) : (
                        <p>
                          预测成功将平分奖池，目前奖池
                          <span>{currentReward} DPY</span>
                        </p>
                      )}
                      <button
                        type="button"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => {
                          if (goodsBuyInfo.userMaxBuyCount == 0) {
                            this.buy();
                          } else if (this.state.amount > goodsBuyInfo.surplusShares) {
                            if (goodsBuyInfo.surplusShares == 0) {
                              showToast(
                                `单个话题最多持有${
                                  goodsBuyInfo.userMaxBuyCount
                                }份,此话题您已到持有上限，去看看其他话题吧！`,
                                2,
                              );
                            } else {
                              showToast(
                                `单个话题最多持有${
                                  goodsBuyInfo.userMaxBuyCount
                                }份,您已持有${goodsBuyInfo.userMaxBuyCount -
                                  goodsBuyInfo.surplusShares}份，此次最多再持有${
                                  this.state.canNum
                                }份`,
                                2,
                              );
                            }
                          } else {
                            this.buy();
                          }
                        }}>
                        确定
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="buyBomBoxOut">
                    <div className="buyBomBox">
                      <NotForecast title="暂无数据" titleTwo="" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <BuyResultDialog
          onConfirm={this.onConfirm}
          hidden={this.state.hidden}
          info={this.state.info}
          text="确定"
        />
      </div>
    );
  }
}
const mapStateToProps = store => ({ serverData: store.purchaseState });
export default connect(mapStateToProps)(withRouter(Buy));
