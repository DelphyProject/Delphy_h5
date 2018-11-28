import React from 'react';
import './index.less';
interface NewAletProps {
  isNewClick: any;
  reward: string | '';
}
export default class NewAlert extends React.Component<NewAletProps> {
  render() {
    return (
      <div className="new-alert">
        <div className="alert-bg-mask" />
        <div className="alert-warp">
          <div className="alert-top">
            <p>
              恭喜您获得了
              <span>
                {this.props.reward}
                预测币
              </span>
            </p>
            <p>立即参与预测，免费赢得DPY</p>
            <div>预测正确即可获得DPY</div>
          </div>
          <div className="alert-btn" onClick={this.props.isNewClick}>
            我知道了
          </div>
        </div>
      </div>
    );
  }
}
