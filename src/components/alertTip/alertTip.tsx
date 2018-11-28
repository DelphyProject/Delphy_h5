import React, { Component, MouseEvent } from 'react';

import './alertTip.less';

interface AlertTipProps {
  hideAlart: Function;
}

class AlertTip extends Component<AlertTipProps> {
  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  handleConfirmBtnClick = () => {
    this.props.hideAlart();
  };

  render() {
    return (
      // <Link to={url} >
      <div className="alertTip" onClick={this.handleClick}>
        <div className="content">
          <div className="head">预测币说明</div>
          <div className="explain">
            <p>1. 预测币是天算为用户提供的福利，可代替DPY参与体验预测话题。</p>
            <p>2. 预测币不可提现，不参与每月分红，不可在用户间转让，仅可参与普通预测话题。</p>
            <p>
              3.
              用户在参与预测话题时，默认优先使用预测币，预测币不够时自动用DPY补全（即一笔交易中可以混用预测币和DPY）。
            </p>
            <p>
              4.
              预测币并非数字资产，为消耗品，使用后即被消耗，不会返还（无论预测结果是否正确）。在计算总资产时，预测币不会被计入
            </p>
          </div>
          <div className="bom" onClick={this.handleConfirmBtnClick}>
            确定
          </div>
        </div>
      </div>
      //  </Link>
    );
  }
}

export default AlertTip;
