import { showToast } from '@/utils/common';
import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import Copy from 'copy-to-clipboard';
import './address.less';
import { baseurl } from '@/config/index';
// import eth from '../../../../../img/eth.svg';
// import usdt from '../../../../../img/usdt.svg';
import * as fetchData from '../../../../../redux/actions/actions_fetchServerData';

interface Kyc1State {
  rechargeOuterState: boolean;
  QRcode: any;
  eventState: boolean;
  ethEachLimit: number;
  ethDailyLimit: number;
  ethRefPrice: number;
  usdtEachLimit: number;
  usdtDailyLimit: number;
  usdtRefPrice: number;
  discount: number;
}
type Props = DispatchProp;
class Kyc1 extends React.Component<Props, Kyc1State> {
  constructor(props) {
    super(props);
    this.state = {
      rechargeOuterState: false,
      QRcode: sessionStorage.getItem('address'),
      eventState: false,
      ethEachLimit: 0,
      ethDailyLimit: 0,
      ethRefPrice: 0,
      usdtEachLimit: 0,
      usdtDailyLimit: 0,
      usdtRefPrice: 0,
      discount: 1,
    };

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

  copyAddressEvent = () => {
    Copy(this.state.QRcode);
    showToast('拷贝成功', 2);
  };

  render() {
    return (
      <div className="addressPage">
        <p>
          您将加密货币发到此地址后，我们会通过扫链获取充值信息，确认交易并调整您的余额，这个过程将耗费一定时间，请您耐心等待。
        </p>
        <div className="addressQRcode">
          <img src={`${baseurl}users/qrcode/${localStorage.getItem('userId')}`} alt="" />
          <p>地址二维码</p>
        </div>
        <div className="address">
          <p>{this.state.QRcode}</p>
          <h6 className="addressCopyBtn" onClick={this.copyAddressEvent}>
            复制地址
          </h6>
        </div>
        <div className="coinListText">
          <p>您可以将以下货币发送到该地址，请不要发送除此之外的任何币种，以免造成损失。</p>
        </div>
        <div className="coinList">
          <div className="coinBox">
            <div className="boxTop">
              <div className="topLeft">
                <img
                  className="coinIcon"
                  width="30px"
                  height="30px"
                  src={require('@/img/dpy.svg')}
                />
              </div>
              <div className="topRight">
                <p>DPY: 天算平台唯一数字通证</p>
              </div>
            </div>
          </div>
          <div className="coinBox">
            <div className="boxTop">
              <div className="topLeft">
                <img
                  className="coinIcon"
                  width="30px"
                  height="30px"
                  src={require('@/img/eth.svg')}
                />
              </div>
              <div className="topRight">
                <p>ETH: 充值后自动兑换为DPY</p>
              </div>
            </div>
            <div className="boxBottom">
              <div className="boxBottomTopLeft">
                <p>
                  单笔限额:
                  {this.state.ethEachLimit} ETH
                </p>
              </div>
              <div className="boxBottomTopRight">
                <p>
                  单日限额:
                  {this.state.ethDailyLimit} ETH
                </p>
              </div>
              <div className="boxBottomBottom">
                <p>实时参考价格: 1 ETH ={this.state.ethRefPrice} DPY</p>
              </div>
            </div>
          </div>
          <div className="coinBox">
            <div className="boxTop">
              <div className="topLeft">
                <img
                  className="coinIcon"
                  width="30px"
                  height="30px"
                  src={require('@/img/usdt.svg')}
                />
              </div>
              <div className="topRight">
                <p>USDT: 充值后自动兑换为DPY</p>
              </div>
            </div>
            <div className="boxBottom">
              <div className="boxBottomTopLeft">
                <p>
                  单笔限额:
                  {this.state.usdtEachLimit} USDT
                </p>
              </div>
              <div className="boxBottomTopRight">
                <p>
                  单日限额:
                  {this.state.usdtDailyLimit} USDT
                </p>
              </div>
              <div className="boxBottomBottom">
                <p>实时参考价格: 1 USDT ={this.state.usdtRefPrice} DPY</p>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Kyc1);
