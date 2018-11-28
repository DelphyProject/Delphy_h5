import React from 'react';
import './_alertBox.less';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
interface AlertBoxProps {
  unLockAmount: number;
  lockDPY: number;
  onSuccess: any;
  hideMethod: any;
}
interface AlertBoxState {
  amount: any;
}
type Props = DispatchProp & AlertBoxProps;
class AlertBox extends React.Component<Props, AlertBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      amount: null,
    };
  }

  unlockDpy = () => {
    if (this.state.amount == null || this.state.amount.trim() == '') {
      showToast('请输入解锁金额', 2);
      return;
    }

    if (this.state.amount - 0 <= 0) {
      showToast('解锁金额必须大于0', 2);
      return;
    }
    if (this.state.amount - 0 > this.props.unLockAmount - 0) {
      showToast('不能超过最大解锁额度', 2);
      return;
    }
    if (this.state.amount - 0 > this.props.lockDPY - 0) {
      showToast('不能超过已锁定金额', 2);
      return;
    }
    const params = {
      unlockDpy: this.state.amount,
    };
    showLoading('loading');
    this.props.dispatch(
      //@ts-ignore
      fetchData.unlock(params, result => {
        hideLoading();
        if (result.code == 200) {
          showToast('解锁成功！', 2);
          this.props.onSuccess();
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  render() {
    return (
      <div className="alertOutBox">
        <div className="contentBox">
          <div className="top">
            <div className="text1">输入解锁金额</div>
            <div className="text2">
              当前解锁额度：
              {this.props.unLockAmount} DPY
            </div>
            <input
              type="number"
              placeholder="解锁额度"
              name="points"
              min="1"
              step={1}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={val => {
                const re = /^\d*$/;
                if (!re.test(val.target.value)) {
                  const num: any = val.target.value;
                  val.target.value = Math.round(num) + '';
                  showToast('只能输入整数', 2);
                }
                this.setState({
                  amount: val.target.value,
                });
              }}
            />
            <div className="text3">将为您优先解锁锁定时间长的DPY</div>
          </div>
          <div className="bom">
            <div
              className="cancel"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.hideMethod();
              }}>
              取消
            </div>
            <div className="confirm" onClick={this.unlockDpy}>
              确定
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.messageState,
});

export default connect(mapStateToProps)(AlertBox);
