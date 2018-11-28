import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Slider } from 'antd-mobile';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { costEstimator } from '@/scenes/findScene/detailScene/lmsr';
import './purchasePage.less';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import ClickWindow from '@/components/clickWindow';
interface BuyProps {
  detailData: any;
  optionId: number;
  serverData: any;
}
interface BuyState {
  secArrOld: any;
  totalMoney: any;
  value: number;
  windowState: boolean;
  hidentState: boolean;
  dataNum: any;
  limit: number;
  nowPrice: any;
  balance: number;
  timeCount: number;
  tip: string;
  isWaiting: boolean;
  percent: number;
  transMoney: number;
  buyGuide: any;
}
type Props = BuyProps & DispatchProp & RouteComponentProps;
class Buy extends React.Component<Props, BuyState> {
  constructor(props) {
    super(props);
    const sBalance: any = sessionStorage.getItem('balance');
    this.state = {
      totalMoney: 0,
      value: 1,
      windowState: false,
      hidentState: false,
      dataNum: {
        numTitle: '买入份数',
        defaultValue: 1,
        min: 1,
        max: 10,
      },
      secArrOld: [],
      limit: 100,
      nowPrice: 0,
      balance: sBalance ? sBalance - 0 : 0,
      timeCount: 10,
      tip: '',
      isWaiting: false,
      percent: 1,
      transMoney: 0,
      buyGuide: '',
    };
  }

  _onChange(value) {
    this.setState({
      value,
    });
    // var marketData=this.props.location.state
    const { marketDetailData } = this.props.detailData;
    const arr: Array<any> = [];
    const newarr: Array<any> = [];
    let options;
    let lossLimit;
    if (!marketDetailData.options) {
      const mmarkets: any = sessionStorage.getItem('markets');
      options = JSON.parse(mmarkets);
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
          volume: val.id == this.props.optionId ? val.totalShares + value : val.totalShares,
        });
      });

      this.onDealNumChange(costEstimator(this.state.secArrOld, newarr, lossLimit), value);
    }
  }

  componentWillMount() {
    this.setState({
      buyGuide: localStorage.getItem('buyGuide'),
    });

    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMarketDetail(this.props.marketId, ret => {
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
          const sMarket: any = sessionStorage.getItem('markets');
          options = JSON.parse(sMarket);
          lossLimit = sessionStorage.getItem('lossLimit');
        }
        if (options) {
          options.forEach(val => {
            arr.push({ id: val.id, volume: val.totalShares });
          });
          options.forEach(val => {
            newarr.push({
              id: val.id,
              volume:
                val.id == this.props.optionId
                  ? val.totalShares + this.state.value
                  : val.totalShares,
            });
          });
          this.setState({
            totalMoney: costEstimator(arr, newarr, lossLimit),
            nowPrice: costEstimator(arr, newarr, lossLimit),
            secArrOld: arr,
          });
        }
      }),
    );
  }

  freshData(options, lossLimit) {
    const arr: Array<any> = [];
    const newarr: Array<any> = [];
    const priceArr: Array<any> = [];
    // var title

    if (!options) {
      const sMarkets: any = sessionStorage.getItem('markets');
      options = JSON.parse(sMarkets);
    }
    if (!lossLimit) {
      lossLimit = sessionStorage.getItem('lossLimit');
    }

    options.forEach(val => {
      arr.push({
        id: val.id,
        volume: val.totlaShares,
      });
      newarr.push({
        id: val.id,
        volume:
          val.id == this.props.optionId ? val.totlaShares + this.state.value : val.totlaShares,
      });
      priceArr.push({
        id: val.id,
        volume: val.id == this.props.optionId ? val.totlaShares + 1 : val.totlaShares,
      });
    });
    this.setState({
      totalMoney: costEstimator(arr, newarr, lossLimit),
      secArrOld: arr,
      nowPrice: costEstimator(arr, priceArr, lossLimit),
    });
  }

  componentDidMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.balance(ret => {
        this.setState({
          balance: ret.data.dpy,
        });
      }),
    );
  }

  // tslint:disable-next-line:variable-name
  _timer = transId => {
    setTimeout(() => {
      if (this.state.timeCount <= 1) {
        hideLoading();
        const tip = this.state.isWaiting
          ? '您的操作已提交系统等待处理，请稍后在交易记录里查看结果'
          : '交易失败';
        this.setState({
          tip,
          windowState: true,
        });
      } else {
        this.setState({ timeCount: this.state.timeCount - 1 });
        this.querryTrans(transId);
      }
    }, 1000);
  };

  querryTrans(transId) {
    this.props.dispatch(
      //@ts-ignore
      fetchData.querryTrans(transId, result => {
        if (result.code == 200) {
          sessionStorage.setItem('isBought', '1');
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
    if (this.state.value > 10) {
      showToast('数据错误', 2);
      return;
    }
    showLoading('交易中');
    const params = {
      optionId: this.props.optionId,
      amount: this.state.value,
      limit: this.state.totalMoney * (1 + this.state.percent / 100),
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.buy(params, result => {
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
              tip: '交易成功',
              isWaiting: false,
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

  onDealNumChange(totalMoney, value) {
    this.setState({ totalMoney, value });
  }

  reduce() {
    if (this.state.percent > 1) {
      this.setState({ percent: this.state.percent - 1 });
    }
  }

  add() {
    if (this.state.percent < 100) {
      this.setState({ percent: this.state.percent + 1 });
    }
  }

  render() {
    const { goodsBuyInfo } = this.props.serverData;
    const { marketDetailData } = this.props.detailData;
    let option;
    if (marketDetailData.options) {
      marketDetailData.options.forEach(val => {
        if (val.id == this.props.optionId) option = val;
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
    const buyColor = {
      backgroundColor: 'rgba(67, 77, 255, 0.9)',
    };

    return (
      <div>
        <Helmet>
          <title>买入</title>
        </Helmet>
        {this.state.windowState ? (
          <ClickWindow
            PromptTxt={this.state.tip}
            transMoney={this.state.isWaiting ? undefined : this.state.transMoney}
          />
        ) : (
          false
        )}
        {this.state.buyGuide == undefined ? (
          <div
            className="buyGuidePage"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              localStorage.setItem('buyGuide', '1');
              this.setState({
                buyGuide: localStorage.getItem('buyGuide'),
              });
            }}>
            <div className="buyCover" />
            <div className="buyGuide">
              <img className="buyGuideImg" src={require('../../../img/Group3.png')} alt="" />
              <div className="buyGuideInner">
                <p>选择买入份数，确定下单</p>
                <p>可以设置成交价格波动范围</p>
                <input type="button" defaultValue="我知道了" />
                <img src={require('../../../img/Group7.png')} alt="" />
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        <div id="topBox">
          <h4 className="text17">{title}</h4>
          <h5 className="title2 ">{option.title}</h5>
          <ul>
            <li className="listItems">
              <span>当前收益率</span>
              <span>
                {this.state.nowPrice == 0
                  ? 0
                  : (((1 - this.state.nowPrice) / this.state.nowPrice) * 100).toFixed(0)}{' '}
                %
              </span>
            </li>
            <li className="listItems">
              <span>当前价格</span>
              <span>{`${this.state.nowPrice.toFixed(2)} DPY`}</span>
            </li>
            {option.holdShares > 0 ? (
              <li className="listItems">
                <span>持有均价</span>
                <span>{(option.holdAvgPrice - 0).toFixed(2)} DPY</span>
              </li>
            ) : (
              false
            )}
            <li className="listItems">
              <span>持有份数</span>
              <span>{option.holdShares} 份</span>
            </li>
          </ul>
        </div>
        <div className="sellOuter">
          <div className="sellNumBox sellNum">
            <span className="balance">可用余额</span>
            <div className="rechargeBtn">
              <Link to="/me/balance">
                <p>充值</p>
              </Link>
              <span>{(this.state.balance - 0).toFixed(2)} DPY</span>
            </div>
          </div>
          <div className="lineNotMar" />
          <p className="numTitle">{this.state.dataNum.numTitle}</p>
          <div className="slideBox">
            <p className="num1">{this.state.value} 份</p>
            <p className="num5">
              <span className="text11 num3">{this.state.dataNum.min}</span>
              <span className="text11 num4">{this.state.dataNum.max}</span>
            </p>

            <Slider
              disabled={false}
              style={{ marginLeft: 5, marginRight: 5, height: 50 }}
              defaultValue={this.state.dataNum.defaultValue}
              min={this.state.dataNum.min}
              max={this.state.dataNum.max}
              value={this.state.value}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={value => {
                this._onChange(value);
              }}
              handleStyle={{
                width: 16,
                height: 16,
                backgroundColor: '#434dff',
                border: 'none',
                opacity: 0.9,
                top: 24,
              }}
              railStyle={{
                marginTop: 20,
                height: 4,
                backgroundColor: '#e7e9ed',
                borderRadius: 4,
              }}
              trackStyle={{
                marginTop: 20,
                height: 4,
                backgroundColor: '#434dff',
                borderRadius: 4,
              }}
            />
          </div>
          <div className="sellDown">
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
            <div className={this.state.hidentState ? 'sellNumPage' : 'sellNumPage sellNumPage1'}>
              <p className="lineNotMar lineNotMarSell" />
              <div className="choiceFloatPage">
                <span>可接受交易上限</span>
                <div className="choiceFloat">
                  <pre
                    style={{
                      color: this.state.percent == 1 ? '#abadb1' : '#212529',
                    }}
                    // tslint:disable-next-line:jsx-no-bind
                    onClick={this.reduce.bind(this)}>
                    -
                  </pre>
                  <div>
                    <p>{this.state.percent}</p>
                    <span>%</span>
                  </div>
                  <pre
                    style={{
                      color: this.state.percent == 100 ? '#abadb1' : '#212529',
                    }}
                    // tslint:disable-next-line:jsx-no-bind
                    onClick={this.add.bind(this)}>
                    +
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="outBox">
          交易量频繁时，预计交易价格会跟实际成交价格不一致，可点击下拉按钮，修改交易设置，限制最终成交价格上限
        </div>
        <div>
          {goodsBuyInfo == ' ' ? (
            <div>正在努力加载中</div>
          ) : (
            <div className="bomOut">
              <p>
                <span className="totalMoney">预计总价：</span>
                <span className="totalMoney">{this.state.totalMoney.toFixed(2)} DPY</span>
              </p>
              <div
                style={buyColor}
                className="sellName"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.deal.bind(this);
                }}>
                购买
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.purchaseState,
  detailData: store.marketDetailState,
});
const purchasePage = withRouter(Buy);

export default connect(mapStateToProps)(purchasePage);
