import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './coinheroIntiteSuccess.less';

class CoinheroRegister extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>注册</title>
        </Helmet>
        <div className="registerSuccPage thisPage">
          <img id="succImg" src={require('../../../../img/coinhero/Group 2.png')} alt="" />
          <p>注册成功</p>
          <div className="registerConfirmInputTwo">
            <Link to="/">进入天算</Link>
          </div>
          <div
            className="registerConfirmInput"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              window.location.href = 'https://hero.delphy.org.cn';
            }}>
            {' '}
            返回币圈英雄
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

export default CoinheroRegister;
