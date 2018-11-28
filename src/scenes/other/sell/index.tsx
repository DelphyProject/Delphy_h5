import { connect, DispatchProp } from 'react-redux';
import React from 'react';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ClickWindow from '@/components/clickWindow';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { costEstimator } from '@/scenes/findScene/detailScene/lmsr';
interface SellProps {
  detailData: any;
  optionId: number;
  serverData: any;
}
interface SellState {
  totalMoney: number;
  windowState: boolean;
  num: number;
  hidentState: boolean;
  value: any;
  secArrOld: any;
  limit: number;
  nowPrice: number;
  timeCount: number;
  tip: string;
  isWaiting: boolean;
  percent: number;
  transMoney: number;
}
type Props = SellProps & DispatchProp & RouteComponentProps;
class Sell extends React.Component<Props, SellState> {
  dataTimer: any;
  constructor(props) {
    super(props);
    this.state = {
      totalMoney: 0,
      windowState: false,
      num: 1,
      hidentState: false,
      value: '1',
      secArrOld: [],
      limit: 0,
      nowPrice: 0,
      timeCount: 10,
      tip: '',
      isWaiting: false,
      percent: 1,
      transMoney: 0,
    };
  }

  _onChange(value) {
    this.setState({
      value,
    });
    const arr: Array<any> = [];
    const newarr: Array<any> = [];
    const { marketDetailData } = this.props.detailData;
    let options;
    let lossLimit;
    if (!marketDetailData.options) {
      const sMarkets: any = sessionStorage.getItem('markets');
      options = JSON.parse(sMarkets);
      lossLimit = sessionStorage.getItem('lossLimit');
    } else {
      // eslint-disable-next-line
      options = marketDetailData.options;
      // eslint-disable-next-line
      lossLimit = marketDetailData.lossLimit;
    }

    if (options) {
      options.forEach(val => {
        arr.push({
          id: val.id,
          volume: val.totalShares,
        });
      });
      options.forEach(val => {
        newarr.push({
          id: val.id,
          volume: val.id == this.props.optionId ? val.totalShares - value : val.totalShares,
        });
      });
      const money: any = costEstimator(this.state.secArrOld, newarr, lossLimit);
      this.onDealNumChange(Math.abs(money), value);
    }
  }

  componentWillUnmount() {
    this.dataTimer && clearInterval(this.dataTimer);
  }

  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMarketDetail(this.props.marketId, ret => {
        // var marketData=this.props.location.state
        const arr: Array<any> = [];
        const newarr: Array<any> = [];
        let options;
        let lossLimit;
        if (ret.code == 200) {
          if (ret.data.options) {
            // eslint-disable-next-line
            options = ret.data.options;
            // eslint-disable-next-line
            lossLimit = ret.data.lossLimit;
          }
        } else {
          const sMarkets: any = sessionStorage.getItem('markets');
          options = JSON.parse(sMarkets);
          lossLimit = sessionStorage.getItem('lossLimit');
        }

        if (options) {
          options.forEach(val => {
            arr.push({
              id: val.id,
              volume: val.totalShares,
            });
          });
          options.forEach(val => {
            newarr.push({
              id: val.id,
              volume:
                val.id == this.props.optionId
                  ? val.totalShares - this.state.value
                  : val.totalShares,
            });
          });
          const cost: any = costEstimator(arr, newarr, lossLimit);
          this.setState({
            totalMoney: Math.abs(cost),
            secArrOld: arr,
            nowPrice: Math.abs(cost),
          });
        }
      }),
    );
    this._refreshData();
  }

  _refreshData() {
    this.dataTimer = setInterval(() => {
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMarketDetail(this.props.marketId, ret => {
          // var marketData=this.props.location.state
          const arr: Array<any> = [];
          const newarr: Array<any> = [];
          const priceArr: Array<any> = [];
          let options;
          let lossLimit;
          if (ret.code == 200) {
            if (ret.data.options) {
              // eslint-disable-next-line
              options = ret.data.options;
              // eslint-disable-next-line
              lossLimit = ret.data.lossLimit;
            }
          } else {
            const sMarkets: any = sessionStorage.getItem('markets');
            options = JSON.parse(sMarkets);
            lossLimit = sessionStorage.getItem('lossLimit');
          }

          if (options) {
            options.forEach(val => {
              arr.push({
                id: val.id,
                volume: val.totalShares,
              });
            });
            options.forEach(val => {
              newarr.push({
                id: val.id,
                volume:
                  val.id == this.props.optionId
                    ? val.totalShares - this.state.value
                    : val.totalShares,
              });
              priceArr.push({
                id: val.id,
                volume: val.id == this.props.optionId ? val.totalShares - 1 : val.totalShares,
              });
            });
            const cost: any = costEstimator(arr, newarr, lossLimit);
            this.setState({
              totalMoney: Math.abs(cost),
              secArrOld: arr,
              nowPrice: Math.abs(cost),
            });
          }
        }),
      );
    }, 5000);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // tslint:disable-next-line:variable-name
  _timer = transId => {
    setTimeout(() => {
      if (this.state.timeCount <= 1) {
        hideLoading();
        this.setState({
          tip: this.state.isWaiting
            ? '您的操作已提交系统等待处理，请稍后在交易记录里查看结果'
            : '交易失败',
          windowState: true,
        });
      } else {
        this.querryTrans(transId);
        this.setState({
          timeCount: this.state.timeCount - 1,
        });
      }
    }, 1000);
  };

  querryTrans(transId) {
    this.props.dispatch(
      //@ts-ignore
      fetchData.querryTrans(transId, result => {
        if (result.code == 200) {
          if (!result.data) {
            hideLoading();
            showToast('无返回数据', 2);
            return;
          }
          if (result.data.status == 2) {
            hideLoading();
            this.setState({
              isWaiting: false,
              tip: '交易成功',
              windowState: true,
              transMoney: result.data.cost,
            });
          } else if (result.data.status == 0) {
            hideLoading();
            showToast(result.data.reason, 2);
          } else if (result.data.status == 1) {
            this.setState({
              isWaiting: true,
              transMoney: result.data.cost,
            });
            this._timer(transId);
          } else if (result.data.status == 3) {
            hideLoading();
            this.setState({
              isWaiting: false,
              tip: '交易成功',
              windowState: true,
              transMoney: result.data.cost,
            });
          }
        } else {
          hideLoading();
          showToast(result.msg, 2);
        }
      }),
    );
  }

  deal() {
    showLoading('交易中');
    const params: any = {};
    params.optionId = this.props.optionId;
    params.amount = this.state.value;
    params.limit = this.state.totalMoney * (1 - this.state.percent / 100);
    this.props.dispatch(
      //@ts-ignore
      fetchData.sell(params, result => {
        if (result.code == 200) {
          if (!result.data) {
            hideLoading();
            showToast('无返回数据', 2);
            return;
          }
          if (result.data.status == 2) {
            hideLoading();
            this.setState({
              isWaiting: false,
              tip: '交易成功',
              transMoney: result.data.cost,
              windowState: true,
            });
          } else if (result.data.status == 0) {
            hideLoading();
            showToast(result.data.reason ? result.data.reason : '交易失败', 2);
          } else if (result.data.status == 1) {
            const transId = result.data.id;

            this._timer(transId);
          } else if (result.data.status == 3) {
            hideLoading();
            this.setState({
              isWaiting: false,
              tip: '交易成功',
              windowState: true,
              transMoney: result.data.cost,
            });
          }
        } else {
          hideLoading();
          showToast(result.msg, 2);
        }
      }),
    );
  }

  reduce() {
    if (this.state.percent > 1) {
      this.setState({
        percent: this.state.percent - 1,
      });
    }
  }

  add() {
    if (this.state.percent < 100) {
      this.setState({
        percent: this.state.percent + 1,
      });
    }
  }

  onDealNumChange(totalMoney, value) {
    this.setState({
      totalMoney,
      num: value,
    });
  }

  render() {
    const { goodsSellInfo } = this.props.serverData;
    // var marketData=this.props.location.state
    const { marketDetailData } = this.props.detailData;
    let option;
    if (marketDetailData.options) {
      marketDetailData.options.forEach(val => {
        if (val.id == this.props.optionId) {
          option = val;
        }
      });
    } else {
      const item: any = sessionStorage.getItem('marketItem');
      option = JSON.parse(item);
    }

    let title;
    if (!marketDetailData.options) {
      title = sessionStorage.getItem('eventTitle');
    } else {
      // eslint-disable-next-line
      title = marketDetailData.title;
    }

    const sellColor = {
      backgroundColor: option.holdShares > 0 ? '#f94b4b' : '#e8e8e8',
    };
    return (
      <div>
        <Helmet>
          <title>卖出</title>
        </Helmet>
        {this.state.windowState ? (
          <ClickWindow
            PromptTxt={this.state.tip}
            transMoney={this.state.isWaiting ? undefined : this.state.transMoney}
          />
        ) : (
          false
        )}
        <div id="topBox">
          <h4 className="text17">{title}</h4>
          <h5 className="title2 ">{option.title}</h5>
          <p className="lineNotMar" />
          <ul>
            <li className="listItems">
              <span>当前收益率</span>
              <span>
                {this.state.nowPrice == 0
                  ? 0
                  : (((1 - this.state.nowPrice) / this.state.nowPrice) * 100).toFixed(0)}{' '}
                %
              </span>
              <p className="lineNotMar" />
            </li>

            <li className="listItems">
              <span>当前价格</span>
              <span>{this.state.nowPrice.toFixed(2)} DPY</span>
              <p className="lineNotMar" />
            </li>

            <li className="listItems">
              <span>持有均价</span>
              <span>{(option.holdAvgPrice - 0).toFixed(2)} DPY</span>
              <p className="lineNotMar" />
            </li>

            <li className="listItems">
              <span>持有份数</span>
              <span>{option.holdShares} 份</span>
              <p className="lineNotMar" />
            </li>

            <li className="listItems">
              <span>已获得收益</span>
              <span>
                {option.totalIncome == 0
                  ? 0
                  : (option.totalIncome - 0 - (option.totalOutcome - 0)).toFixed(2)}{' '}
                DPY
              </span>
            </li>
          </ul>
        </div>
        <div className="lineCrude" />
        <div className="sellOuter">
          <div className="sellNumBox">
            <span>卖出份数</span>
            <div className="sellNumBoxInp">
              <input
                defaultValue={'1'}
                value={this.state.value}
                type="number"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  const aaa: any = e.target.value;
                  if (aaa - 0 > option.holdShares) {
                    this._onChange(option.holdShares);
                  } else if (aaa - 0 >= 1) {
                    this._onChange((aaa - 0).toFixed(0));
                  } else {
                    this._onChange('');
                  }
                }}
                max={`${option.holdShares}`}
                // tslint:disable-next-line:jsx-no-lambda
                onBlur={e => {
                  let aaa: any = e.target.value;
                  aaa = (aaa - 0).toFixed(0);
                  if (aaa < 1) {
                    this._onChange(1);
                  }
                }}
              />
              <span>份</span>
            </div>
          </div>
          <div className="sellDown">
            <p className="lineNotMar lineNotMarSell" />

            {this.state.hidentState == false ? (
              false
            ) : (
              <div>
                <div className="choiceFloatPage">
                  <span>可接受交易下限</span>
                  <div className="choiceFloat">
                    <pre
                      style={{ color: this.state.percent == 1 ? '#abadb1' : '#212529' }}
                      // tslint:disable-next-line:jsx-no-bind
                      onClick={this.reduce.bind(this)}>
                      -
                    </pre>
                    <div>
                      <p>{this.state.percent}</p>
                      <span>%</span>
                    </div>
                    <pre
                      style={{ color: this.state.percent == 100 ? '#abadb1' : '#212529' }}
                      // tslint:disable-next-line:jsx-no-bind
                      onClick={this.add.bind(this)}>
                      +
                    </pre>
                  </div>
                </div>
              </div>
            )}
            <div
              className="arrow_down_outer"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  hidentState: !this.state.hidentState,
                });
              }}>
              {this.state.hidentState ? (
                <div className="icon-details_icon_moreinfo_normal arrow_down icoRotate" />
              ) : (
                <div className="icon-details_icon_moreinfo_normal arrow_down" />
              )}
            </div>
          </div>
        </div>
        <div className="outBox" style={{ paddingBottom: `${0.5}rem` }}>
          交易量频繁时，预计交易价格会跟实际成交价格不一致，可点击下拉按钮，修改交易设置，限制最终成交价格下限
        </div>
        <div>
          {goodsSellInfo == ' ' ? (
            <div>正在努力加载中</div>
          ) : (
            <div className="bomOut">
              <p>
                <span className="totalMoney">预计总价：</span>
                <span className="totalMoney">{this.state.totalMoney.toFixed(2)}</span>
              </p>
              <div
                style={sellColor}
                className="sellNameSell"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  if (option.holdShares <= 0) return;
                  this.deal();
                }}>
                卖出
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.sellState,
  detailData: store.marketDetailState,
});
const sellPage = withRouter(Sell);
export default connect(mapStateToProps)(sellPage);
