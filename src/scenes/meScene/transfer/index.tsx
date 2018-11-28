import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import './transfer.less';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
interface TransferState {
  rechargeOuterState: boolean;
  balance: any;
  amount: any;
  cointype: number;
  phone: string;
  password: string;
  withdrawWindowstate: boolean;
  fee: number;
}
type Props = DispatchProp & RouteComponentProps;
class Transfer extends React.Component<Props, TransferState> {
  constructor(props) {
    super(props);
    this.state = {
      rechargeOuterState: false,
      balance: sessionStorage.getItem('balance'),
      amount: '',
      cointype: 1, // 1 dpy,2 eth,3 btc
      phone: '',
      password: '',
      withdrawWindowstate: false,
      fee: 0,
    };
  }

  render() {
    return (
      <div className="transfer">
        <Helmet>
          <title>DPY转账</title>
        </Helmet>
        <div className="withdraw address">
          <p>收款手机</p>

          <input
            type="text"
            defaultValue={this.state.phone}
            placeholder="收款人天算注册手机号码"
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => {
              e.target.value = e.target.value.replace(/[^0-9]+/, '');
              this.setState({
                phone: e.target.value,
              });
            }}
          />
        </div>
        <div className="withdraw money">
          <p>转账金额</p>
          <input
            placeholder="请输入整数转账金额"
            defaultValue={this.state.amount}
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => {
              e.target.value = e.target.value.replace(/[^0-9]+/, '');
              e.target.value
                ? this.setState({
                    amount: e.target.value,
                    fee: 2,
                  })
                : this.setState({
                    amount: e.target.value,
                    fee: 0,
                  });
            }}
          />
        </div>
        <p className="moneyOnline">
          <span />
          当前余额: {this.state.balance} DPY
        </p>
        <p className="transferBullet">·每次转账最小额度为10DPY。</p>
        <p className="transferBullet">·该功能为平台内转账，收款人需为天算注册用户。</p>
        <p className="transferBullet">·天算平台内DPY转账不收手续费，即时到账，无需等待。</p>
        <input
          type="button"
          className="withdrawBtn font_weight"
          value="下一步"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            const myKycLevel = Number(sessionStorage.getItem('kycLevel'));
            const minTransferKyc = Number(sessionStorage.getItem('minTransferKyc'));

            // If minTransferKyc > 100 you can get here. You must have met KYC requirement
            // No need to check. The backend server will block any invalid access anyways
            if (minTransferKyc < 100 && myKycLevel < minTransferKyc) {
              showToast('您的KYC等级不足，无法进行此操作', 2);
              return;
            }

            // Checks phone format
            if (this.state.phone.length == 0) {
              showToast('请输入收款人手机号', 2);
              return;
            }
            if (this.state.phone.length != 11) {
              showToast('收款人手机号格式错误', 2);
              return;
            }

            // Checks transfer amount
            if (!this.state.amount || this.state.amount.length <= 0) {
              showToast('请输入转账金额', 2);
              return;
            }

            if (this.state.amount - 0 <= 0) {
              showToast('请输入正确的金额', 2);
              return;
            }
            // Checks transfer amount
            if (Number(this.state.amount) < 10) {
              showToast('每次转账最小金额为10DPY，请您重新输入', 2);
              return;
            }
            const patrn = /^[0-9]*$/;
            if (!patrn.test(this.state.amount)) {
              showToast('提现金额必须为正整数', 2);
              return;
            }
            if (this.state.amount - 0 > this.state.balance) {
              showToast('您的余额不足', 2);
              return;
            }

            this.props.dispatch(
              //@ts-ignore
              fetchData.fetchOtherInfoByPhone(this.state.phone, null, ret => {
                if (ret.code == 200) {
                  if (ret.data == null) {
                    showToast('该手机号不是天算用户', 2);
                    return;
                  }
                  if (ret.data.id == localStorage.getItem('userId')) {
                    showToast('您不能向自己转账', 2);
                    return;
                  }
                  this.props.history.push({
                    pathname: '/me/transferConfirm',
                    state: {
                      userId: ret.data.id,
                      nickname: ret.data.nickname,
                      avatar: ret.data.avatar,
                      amount: this.state.amount - 0,
                    },
                  });
                } else {
                  showToast('用户信息加载失败', 2);
                }
              }),
            );
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.messageState,
});

export default connect(mapStateToProps)(Transfer);
