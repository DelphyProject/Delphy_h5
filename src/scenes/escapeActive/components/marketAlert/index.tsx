import React from 'react';
import './marketAlert.less';

interface MarketAlertPorps {
  btnClick: Function;
}

class MarketAlert extends React.Component<MarketAlertPorps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  btnClick = () => {
    this.props.btnClick(false);
  };

  render() {
    return (
      <div className="market-alert">
        <div className="mask-mask" />
        <div className="alert-content">
          <div className="font-box">新预测话题已经开始，快去参与吧！</div>
          <div className="btn-box" onClick={this.btnClick}>
            确 定
          </div>
        </div>
      </div>
    );
  }
}
export default MarketAlert;
