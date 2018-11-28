import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './imtokenRecharge.less';
import { network } from '@/config/index';

interface ImtokenRechargeProps {
  serverData: any;
  location: any;
}
interface ImtokenRechargeState {
  volume: number;
  rechargeOuterState: boolean;
  amount: number;
  cointype: any;
  coinname: string;
  address: string;
  password: string;
  fee: number;
  balance: any;
  ethEachLimit: number;
  ethDailyLimit: number;
  ethRefPrice: number;
  usdtEachLimit: number;
  usdtDailyLimit: number;
  usdtRefPrice: number;
  discount: number;
}
type Props = ImtokenRechargeProps & DispatchProp & RouteComponentProps;
class ImtokenRecharge extends React.Component<Props, ImtokenRechargeState> {
  memo: string;
  constructor(props) {
    super(props);

    const { coinType } = this.props.location.state;
    let coinname = 'USDT';
    if (coinType == 1) {
      coinname = 'DPY';
    } else if (coinType == 2) {
      coinname = 'ETH';
    } else if (coinType == 2) {
      coinname = 'BTC';
    }
    this.memo = '';
    this.state = {
      volume: 0,
      rechargeOuterState: false,
      amount: 0,
      cointype: this.props.location.state.coinType, // 1 dpy,2 eth,3 btc,4 usdt
      coinname,
      address: '',
      password: '',
      fee: 0,
      balance: null,
      ethEachLimit: 0,
      ethDailyLimit: 0,
      ethRefPrice: 0,
      usdtEachLimit: 0,
      usdtDailyLimit: 0,
      usdtRefPrice: 0,
      discount: 1,
    };

    // Checks address balance
    if (typeof window.web3 == 'undefined') {
      window.addEventListener('sdkReady', this.checkBalance);
    } else {
      setTimeout(this.checkBalance, 1);
    }

    this.props.dispatch(
      //@ts-ignore
      fetchData.tokenSwap(null, ret => {
        if (ret.code == 200) {
          // Successfully got token swap info
          this.setState({
            ethEachLimit: Math.round(ret.data.ethEachLimit * 100) / 100,
            ethDailyLimit: Math.round(ret.data.ethDailyLimit * 100) / 100,
            ethRefPrice: Math.round(ret.data.ethRefPrice * 100) / 100,
            usdtEachLimit: Math.round(ret.data.usdtEachLimit * 100) / 100,
            usdtDailyLimit: Math.round(ret.data.usdtDailyLimit * 100) / 100,
            usdtRefPrice: Math.round(ret.data.usdtRefPrice * 10000) / 10000,
            discount: Math.round(ret.data.discount * 100) / 100,
          });
        } else {
          // Failed
          showToast('获取实时兑换信息失败', 2);
        }
      }),
    );
  }

  checkBalance = () => {
    if (this.state.cointype == 2) {
      const balance = window.web3.eth.getBalance(window.web3.eth.defaultAccount);
      const thisBalance: any = {
        balance: balance / 1000000000000000000,
      };
      this.setState(thisBalance);
    } else {
      const params = {
        token: this.state.cointype,
        network: network == 'mainnet' ? 1 : 2,
        address: window.web3.eth.defaultAccount,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.checkAddressBalance(params, ret => {
          if (ret.code == 200) {
            this.setState({
              balance: ret.data,
            });
          } else {
            showToast('查询钱包余额失败', 2);
          }
        }),
      );
    }
  };

  getVolume = v => {
    this.setState({
      amount: v,
      volume: this.state.cointype == 4 ? v * 1000000 : v * 1000000000000000000, // 6 decimals for USDT only
    });
  };

  getMemo = v => {
    this.memo = v;
  };

  callImtokenPay() {
    if (this.state.volume <= 0) {
      showToast('请输入充值金额', 2);
      return;
    }

    // If balance is available
    if (this.state.balance != null && this.state.amount > this.state.balance) {
      showToast(`您的${this.state.coinname}余额不足`, 2);
      return;
    }

    const thisAddress: any = sessionStorage.getItem('address');
    let params: any;
    if (this.state.cointype == 2) {
      // ETH
      params = {
        from: window.web3.eth.defaultAccount,
        to: thisAddress.toString(),
        value: this.state.volume,
        gas: 21273,
        gasPrice: window.web3.toWei('20', 'gwei'),
        memo: this.memo,
        feeCustomizable: false,
      };
    } else {
      let to;
      switch (this.state.cointype) {
        case 1:
          // DPY
          switch (network) {
            case 'mainnet':
              to = '0x6c2adc2073994fb2ccc5032cc2906fa221e9b391';
              break;
            case 'kovan':
              to = '0x3c43f7c4582b24262f95561c9db08e9d8ca90877';
              break;
            default:
              break;
          }
          break;
        case 4:
          // USDT
          switch (network) {
            case 'mainnet':
              to = '0xdac17f958d2ee523a2206206994597c13d831ec7';
              break;
            case 'kovan':
              to = '0x8f3fd7dc90071095df78f181b5f4031b4988e192';
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }

      const data = `0xa9059cbb000000000000000000000000${thisAddress
        .toString()
        .replace(
          '0x',
          '',
        )}${`0000000000000000000000000000000000000000000000000000000000000000${window.web3
        .toHex(this.state.volume)
        .replace('0x', '')}`.slice(-64)}`;
      params = {
        from: window.web3.eth.defaultAccount,
        to,
        value: 0,
        gas: 69273,
        gasPrice: window.web3.toWei('20', 'gwei'),
        data,
        memo: this.memo,
        feeCustomizable: false,
      };
    }

    window.imToken.callAPI('transaction.tokenPay', params, err => {
      if (err) {
        // alert(err)
        if (err.code == 1001) {
          // User cancelled
        } else if (err.message.includes('Asset not found')) {
          window.imToken.callAPI(
            'native.alert',
            `请先将${this.state.coinname}加入您的imToken资产列表`,
          );
        } else {
          window.imToken.callAPI('native.alert', `发生错误：${err.message} [${err.code}]`);
        }
      } else {
        const rechargeWindowPage: any = document.getElementById('rechargeWindowPage');
        rechargeWindowPage.style.display = 'block';
      }
    });
  }

  render() {
    return (
      <div className="imtokenRecharge">
        <Helmet>
          <title>ImToken充值</title>
        </Helmet>
        <div className="rechargeCard">
          <span className="text_white_14 cardTip">
            即将转入(
            {this.state.coinname}){' '}
          </span>
          <span className="text_white_30 cardAmount">+{this.state.amount}</span>
          <span className="text_white_20 cardBalance">
            {this.state.balance == null ? '' : `${this.state.coinname}余额: ${this.state.balance}`}
          </span>
        </div>
        <div className="inputParent">
          <span className="text_black_15 inputAmountTip">
            输入充值金额(
            {this.state.coinname}){' '}
          </span>
          <input
            className="inputAmount"
            type="number"
            placeholder="请输入"
            // tslint:disable-next-line:jsx-no-lambda
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9.]+/, '');
            }}
            // tslint:disable-next-line:jsx-no-lambda
            onChange={va => {
              this.getVolume(va.target.value);
            }}
          />
          <div className="dividingLine" />
          {this.state.cointype == 1 ? (
            <span className="text_black_15 inputNoteTip">请输入备注信息</span>
          ) : null}
          {this.state.cointype == 1 ? (
            <textarea
              className="inputNote"
              placeholder="最多输入24个字"
              id=""
              cols={15}
              rows={2}
              maxLength={24}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={va => {
                this.getMemo(va.target.value);
              }}
            />
          ) : null}
          {this.state.cointype == 1 ? null : (
            <div className="coinBox">
              <div className="boxTop">
                <div className="topLeft">
                  <img
                    className="coinIcon"
                    width="30px"
                    height="30px"
                    src={
                      this.state.cointype == 2
                        ? require('@/img/eth.svg')
                        : require('@/img/usdt.svg')
                    }
                  />
                </div>
                <div className="topRight">
                  <p>{this.state.coinname}: 充值后自动兑换为DPY</p>
                </div>
              </div>
              <div className="boxBottom">
                <div className="boxBottomTopLeft">
                  <p>
                    单笔限额:
                    {this.state.cointype == 2
                      ? this.state.ethEachLimit
                      : this.state.usdtEachLimit}{' '}
                    {this.state.coinname}
                  </p>
                </div>
                <div className="boxBottomTopRight">
                  <p>
                    单日限额:
                    {this.state.cointype == 2
                      ? this.state.ethDailyLimit
                      : this.state.usdtDailyLimit}{' '}
                    {this.state.coinname}
                  </p>
                </div>
                <div className="boxBottomBottom">
                  <p>
                    实时参考价格: 1{this.state.coinname} =
                    {this.state.cointype == 2 ? this.state.ethRefPrice : this.state.usdtRefPrice}{' '}
                    DPY
                  </p>
                </div>
              </div>
            </div>
          )}
          {this.state.cointype == 1 ? null : (
            <div className="tipsBox">
              <p> · 上述价格仅供参考，具体以充值时兑换价格为准。</p>
              <p>
                {' '}
                · 兑换价格取充值时Gate.io交易所于该分钟的收盘价，并收取
                {Math.round((1 - this.state.discount) * 100 * 100) / 100}
                %作为手续费。
              </p>
              <p> · 充值时间以区块链上交易所在的区块时间戳为准。</p>
              <p> · 兑换额度每日北京时间00:00清零。</p>
            </div>
          )}
          <div className="dividingLine" />
        </div>
        <div className="mid" />
        <div className="bottomRecharge">
          <span className="rechargeTip">充值过程将消耗一定时间，请您耐心等待</span>
          <span
            className="recharge"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.callImtokenPay;
            }}>
            确认充值
          </span>
        </div>
        <div className="rechargeWindowPage" id="rechargeWindowPage">
          <div className="rechargeWindowCover" />
          <div className="rechargeWindow">
            <p>充值成功。充值确认会持续一定时间，待区块稳定后我们会为您增加余额，请您耐心等待</p>
            <div className="lineNotMar" />
            <pre
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.goBack();
              }}>
              确定
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(ImtokenRecharge);
