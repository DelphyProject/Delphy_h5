import React from 'react';
import { DispatchProp } from 'react-redux';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { showToast } from '@/utils/common';
import { isLogin } from '../../../../utils/tool';

import './index.less';

interface MineTopProps {
  serverData: any;
  data: any;
  newsCount: string;
  from: any;
}

type Props = MineTopProps & DispatchProp & RouteComponentProps;
let balance: any = 0;
let freezedDpy: any = 0;
let lockedDpy: any = 0;
let useableDpy: any = 0;
let useableDummyDpy: any = 0;
class MineTop extends React.Component<Props> {
  classItems: any;
  constructor(props) {
    super(props);
    this.classItems = [
      {
        outClass: 'cash-icon cash-icon1',
        className: 'iconfont icon-me_icon_wallet',
        title: '充值提现',
        path: '/me/balance',
      },
      {
        outClass: 'cash-icon cash-icon2',
        className: 'iconfont icon-me_icon_unlock',
        title: 'DPY锁定',
        path: '/me/lockdesc',
      },
      {
        outClass: 'cash-icon cash-icon3',
        className: 'iconfont icon-me_icon_transfer',
        title: '应用内转账',
        path: '/me/transfer',
      },
      {
        outClass: 'cash-icon cash-icon4',
        className: 'iconfont icon-me_icon_authenticati',
        title: '身份认证',
        path: '/',
      },
    ];
  }

  getLogin = e => {
    if (!window.localStorage.getItem('token')) {
      e.preventDefault();
      showToast('请登录', 1);
    }
  };

  render() {
    let avatar;
    let nickname = '';
    let description = '';
    if (this.props.data && this.props.data.avatar) {
      if (this.props.data.avatar.indexOf('.bkt') > 0) {
        avatar = `${this.props.data.avatar}?imageView2/1/w/100/h/100`;
      } else {
        avatar = this.props.data.avatar;
      }
    } else {
      avatar = require('../../../../img/my_photo_none.png');
    }
    if (this.props.data != null) {
      freezedDpy =
        this.props.data.dpyFreeze != undefined ? (this.props.data.dpyFreeze - 0).toFixed(2) : '- -';
      lockedDpy =
        this.props.data.dpyLocked != undefined ? (this.props.data.dpyLocked - 0).toFixed(2) : '- -';
      useableDpy = this.props.data.dpy != undefined ? (this.props.data.dpy - 0).toFixed(2) : '- -';
      useableDummyDpy =
        this.props.data.dpyDummy != undefined ? (this.props.data.dpyDummy - 0).toFixed(2) : '- -';
      balance =
        this.props.data.dpy == undefined ||
        this.props.data.dpyFreeze == undefined ||
        this.props.data.dpyLocked == undefined
          ? 0
          : (
              this.props.data.dpy -
              0 +
              (this.props.data.dpyFreeze - 0) +
              (this.props.data.dpyLocked - 0)
            ).toFixed(2);
      nickname = this.props.data.nickname;
      description = this.props.data.description;
    }
    // 头像处胜率渲染函数
    const winRateRender = () => {
      if (this.props.data.statisticsVO && this.props.data.statisticsVO.length) {
        switch (this.props.data.statisticsVO[0].grade) {
          case 'newbie':
            return <span className="level1">新手</span>;
            break;
          case 'white':
            return (
              <span className="level1">
                胜率
                {this.props.data.statisticsVO[0].winRate}
              </span>
            );
            break;
          case 'yellow':
            return (
              <span className="level2">
                胜率
                {this.props.data.statisticsVO[0].winRate}
              </span>
            );
            break;
          case 'red':
            return (
              <span className="level3">
                胜率
                {this.props.data.statisticsVO[0].winRate}
              </span>
            );
            break;
          default:
            return <span className="level1">胜率0%</span>;
            break;
        }
      } else {
        return <span className="level1">胜率0%</span>;
      }
    };
    return (
      <div className="mine-top">
        <div className="top-bar">
          <Link
            to="/me/setting"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={e => {
              this.getLogin(e);
            }}>
            <span className="iconfont icon-me_icon_set" />
          </Link>
          <Link
            className={this.props.newsCount ? 'msg-icon red-icon' : 'msg-icon'}
            to="/me/message"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={e => {
              this.getLogin(e);
            }}>
            <span className="iconfont icon-Group1" />
          </Link>
        </div>
        <div className="my-balance-out">
          <div className="my-balance headLeft">
            <div className="my-title">账户余额(DPY)</div>
            <div className="my-price">{balance || '- -'}</div>
          </div>
          <div className="my-balance">
            <div className="my-title">预测币</div>
            <div className="my-price">{useableDummyDpy || '- -'}</div>
          </div>
        </div>

        <div className="top-bottom">
          <div className="bottom-cell">
            <p className="bottom-title">可用DPY</p>
            <p className="bottom-num">{useableDpy || '- -'}</p>
          </div>
          <div className="bottom-cell">
            <p className="bottom-title">
              锁定
              <Link
                className="lock-info"
                to="/me/lockdesc"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  if (!window.localStorage.getItem('token')) {
                    e.preventDefault();
                    showToast('请登录', 1);
                  }
                }}
              />
            </p>
            <p className="bottom-num">{lockedDpy || '- -'}</p>
          </div>
          <div className="bottom-cell">
            <p className="bottom-title">提现中</p>
            <p className="bottom-num">{freezedDpy || '- -'}</p>
          </div>
        </div>
        <div className="user-info">
          <div className="user-img">
            {isLogin(true) ? (
              <div
                className="warp-head"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  if (this.props.from == 1) {
                    return;
                  }
                  sessionStorage.setItem('user', JSON.stringify(this.props.data));
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  if (isLogin(true)) {
                    this.props.history.push('/me/editInfo');
                  }
                }}>
                <img src={avatar} />
                {winRateRender()}
                <div className="user-font">
                  <div className="user-name">{nickname || ''}</div>
                  <div className="user-tag">{description || '这家伙很懒，什么也没有留下！'}</div>
                </div>
              </div>
            ) : (
              <div
                className="warp-head"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.push('/login');
                }}>
                <img src={avatar} />
                <div className="user-font">
                  <div className="login-name">登录/注册</div>
                </div>
              </div>
            )}
          </div>
          <ul className="icon-warp">
            {this.classItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={e => {
                    if (!window.localStorage.getItem('token')) {
                      e.preventDefault();
                      showToast('请登录', 1);
                    } else if (item.path == '/') {
                      e.preventDefault();
                      showToast('暂未开放此功能！', 2);
                    }
                  }}>
                  <div className={item.outClass}>
                    <span className={item.className} />
                  </div>
                  <p>{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default withRouter(MineTop);
