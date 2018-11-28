import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, RouteComponentProps } from 'react-router-dom';
import './intiteSuccess.less';

class Register extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <Helmet>
          <title>注册</title>
        </Helmet>
        <div className="registerSuccPage">
          <img src={require('../../../../img/Bdone.png')} alt="" />
          <p>注册成功</p>
          <div
            className="registerConfirmInput"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              // window.location.href = downLoadUrl
              const cid = sessionStorage.getItem('channelId');
              if (cid != undefined && cid != '') {
                this.props.history.push(`/download?c=${cid}`);
              } else {
                this.props.history.push('/download');
              }
            }}>
            {' '}
            立即下载天算APP
          </div>
          <div className="registerConfirmInputTwo">
            <Link to="/">进入天算</Link>
          </div>
          <div className="dpyBox">
            <img src={require('./../../../../img/dpyImg.png')} />
            <p>扫描二维码下载天算APP</p>
            <p>百万大奖等你拿</p>
            <p>(目前只支持安卓版本)</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
