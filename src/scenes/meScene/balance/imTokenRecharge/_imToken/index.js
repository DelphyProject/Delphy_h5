import React from 'react';
import { withRouter } from 'react-router-dom';
import './imToken.less';
import { showToast } from '@/utils/common';

class imtokenRecharge extends React.Component {
  constructor(props) {
    super(props);
    this.volume = 0;
    this.memo = '';
    this.state = {
      rechargeOuterState: false,
      amount: '',
      cointype: 1, // 1 dpy,2 eth,3 btc
      address: '',
      password: '',
      fee: 0,
    };
  }

  getVolume = v => {
    this.volume = v * 1000000000000000000;
  };

  getMemo = v => {
    this.memo = v;
  };

  componentDidMount() {}

  callImtokenPay() {
    if (this.volume <= 0) {
      showToast('请输入充值金额', 2);
      return;
    }
    const params = {
      contractAddress: '0x3c43f7c4582b24262f95561c9db08e9d8ca90877', // 必须小写
      to: sessionStorage.getItem('address'),
      from: window.web3.eth.defaultAccount,
      value: this.volume,
      orderInfo: this.memo,
      customizable: true,
    };
    imToken.callAPI('transaction.tokenPay', params, err => {
      if (err) {
      } else {
        const rechargeWindowPage = document.getElementById('rechargeWindowPage');
        rechargeWindowPage.style.display = 'block';
        // that.history.goBack()
        // this.props.onsuccess()
      }
    });
  }

  render() {
    return (
      <div className="imTokenRechargePage">
        <div className="imtokenBalanceInput">
          <p>充值金额</p>
          <input
            type="number"
            onInput={e => {
              e.target.value = e.target.value.replace(/[^0-9.]+/, '');
            }}
            placeholder="请输入充值金额"
            onChange={va => {
              this.getVolume(va.target.value);
            }}
          />
          <span>DPY</span>
        </div>
        <div className="imtokenBalanceInput">
          <p>备注</p>
          <textarea
            name=""
            id=""
            cols="15"
            rows="2"
            maxLength="24"
            onChange={va => {
              this.getMemo(va.target.value);
            }}
            placeholder="最多输入24个字"
          />
        </div>
        <p className="prompt">·充值过程将耗费一定时间，请您耐心等待。</p>
        <input
          type="button"
          className="imTokenRechargeBtn"
          onClick={this.callImtokenPay.bind(this)}
          value="确认充值"
        />
        <div className="rechargeWindowPage" id="rechargeWindowPage">
          <div className="rechargeWindowCover" />
          <div className="rechargeWindow">
            <p>充值成功。充值确认会持续一定时间，待区块稳定后我们会为您增加余额，请您耐心等待</p>
            <div className="lineNotMar" />
            <pre
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

export default withRouter(imtokenRecharge);
