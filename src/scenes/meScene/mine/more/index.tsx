import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';
import { showToast } from '@/utils/common';

const getLogin = e => {
  if (!window.localStorage.getItem('token')) {
    e.preventDefault();
    showToast('请登录', 1);
  }
};
const MoreLink = () => (
  <div className="more-warp">
    <Link
      className="more-item"
      to="/me/transactionRecord"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={e => {
        getLogin(e);
      }}>
      <div className="item-icon">
        <img src={require('./../../../../img/record-list.png')} />
      </div>
      <p>收支记录</p>
    </Link>
    <Link
      className="more-item"
      to="/me/favorite"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={e => {
        getLogin(e);
      }}>
      <div className="item-icon">
        <span className="iconfont icon-shoucang" />
      </div>
      <p>收藏</p>
    </Link>
    <Link
      className="more-item"
      to="/me/contact"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={e => {
        getLogin(e);
      }}>
      <div className="item-icon">
        <img src={require('./../../../../img/recod-msg.jpg')} />
      </div>
      <p>联系我们</p>
    </Link>
  </div>
);
export default MoreLink;
