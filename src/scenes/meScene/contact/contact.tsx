import React from 'react';
import { withRouter } from 'react-router-dom';
import { showToast } from '@/utils/common';
import Copy from 'copy-to-clipboard';
import './contact.less';
import { Helmet } from 'react-helmet';
interface ContactState {
  isPhoneGap: boolean;
}
class Contact extends React.Component<{}, ContactState> {
  constructor(props) {
    super(props);
    this.state = {
      isPhoneGap: !!parent.isPhoneGap,
    };
  }

  render() {
    return (
      <div className="contactBox">
        <Helmet>
          <title>联系我们</title>
        </Helmet>
        <div className="items">
          <div className="leftItem">
            <img src={require('@/img/contact/wechat.png')} />
            <span>
              <span className="title">客服微信</span> <span>dongdongsong2020</span>
            </span>
          </div>
          <button
            type="button"
            className="rightItem"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              Copy('dongdongsong2020');
              showToast('复制成功', 2);
            }}>
            点击复制
          </button>
        </div>
        <div className="lines" />
        <div className="items">
          <div className="leftItem">
            <img src={require('@/img/contact/wechat.png')} />
            <span>
              <span className="title">微信公众号 </span> <span>TSDelphy</span>
            </span>
          </div>
          <button
            type="button"
            className="rightItem"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              Copy('TSDelphy');
              showToast('复制成功', 2);
            }}>
            点击复制
          </button>
        </div>
        <div className="lines" />
        <div
          className="items"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (this.state.isPhoneGap) {
              parent.openLinkInbBrowser('http://weibo.com/delphy2016');
            } else {
              window.location.href = 'http://weibo.com/delphy2016';
            }
          }}>
          <div className="leftItem">
            <img src={require('./../../../img/contact/weibo.png')} />
            <span>
              <span className="title">新浪微博 </span> <span>{'http://weibo.com/delphy2016'}</span>
            </span>
          </div>
          {this.state.isPhoneGap ? (
            <a
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                parent.openLinkInbBrowser('http://weibo.com/delphy2016');
              }}>
              {' '}
              <span className="icon-public_narrow_list_m iconfontMarket back rightIcon" />
            </a>
          ) : (
            <a href="http://weibo.com/delphy2016">
              {' '}
              <span className="icon-public_narrow_list_m iconfontMarket back rightIcon" />
            </a>
          )}
        </div>
        <div className="lines" />
        <div
          className="items"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (this.state.isPhoneGap) {
              parent.openLinkInbBrowser('https://t.me/Delphyfans');
            } else {
              window.location.href = 'https://t.me/Delphyfans';
            }
          }}>
          <div className="leftItem2">
            <img src={require('@/img/contact/telegram.png')} />
            <span>
              <span className="title">Telegram </span> <span> {'https://t.me/Delphyfans'}</span>
            </span>
          </div>
          {this.state.isPhoneGap ? (
            <a
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                parent.openLinkInbBrowser('https://t.me/Delphyfans');
              }}>
              {' '}
              <span className="icon-public_narrow_list_m iconfontMarket back rightIcon" />
            </a>
          ) : (
            <a href="https://t.me/Delphyfans">
              {' '}
              <span className="icon-public_narrow_list_m iconfontMarket back rightIcon" />
            </a>
          )}
        </div>
        <div className="lines" />
      </div>
    );
  }
}
export default withRouter(Contact);
