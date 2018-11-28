import React from 'react';
import './tipAlert.less';
interface TipAlertProps {
  hideMethod: any;
  tipToLogin: any;
  toTeachPage: any;
}
export default class TipAlert extends React.Component<TipAlertProps> {
  render() {
    return (
      <div
        className="tipAlert"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}>
        <div className="main">
          <div className="topTip">
            <div className="textBox">
              <p>新用户注册就送</p>
              <p>20预测币</p>
            </div>
            <img
              className="img2"
              src={require('../../../../img/find/tip_btn.png')}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.tipToLogin();
              }}
            />
            <a
              className="textBom"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.toTeachPage();
              }}>
              查看预测币玩法教程
            </a>
          </div>
          <img
            className="img3"
            src={require('../../../../img/find/tip_close.png')}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.hideMethod();
            }}
          />
        </div>
      </div>
    );
  }
}
