import { isWechat, isIOS } from '@/utils/device';

const wx = require('weixin-js-sdk');

const url = 'https://test.cokeway.info/wx/share';
function post(url, param, callback) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  })
    .then(response => response.json())
    .then(result => {
      if (callback) {
        callback(result);
      }
    })
    .catch(() => {
      if (callback) {
        callback({
          code: 90001,
          msg: '数据错误',
          data: [],
          timestamp: '',
        });
      }
    });
}

export const shareMethod = obj => {
  if (!isWechat) return null;
  const paramObj = {
    shareUrl: obj.shareUrl,
    type: obj.type,
    id: obj.id,
    userId: obj.userId,
  };
  return post(url, paramObj, result => {
    if (!result) return;
    wx.config({
      debug: false,
      appId: 'wx811d8ab8f482fff0',
      timestamp: result.timestamp,
      nonceStr: result.nonceStr,
      signature: result.signature,
      jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'],
    });
    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: result.title,
        imgUrl: result.imgUrl,
        desc: result.description,
        link: location.href.split('#')[0],
        type: 'link',
        success() {
          //
        },
        cancel() {
          //
        },
      });
      wx.onMenuShareTimeline({
        title: result.title,
        imgUrl: result.imgUrl,
        desc: result.description,
        link: location.href.split('#')[0],
        type: 'link',
        success() {
          //
        },
        cancel() {
          //
        },
      });
    });
    wx.error(() => {
      //
    });
  });
};

export const redirect = () => {
  if (!isWechat) return;
  const index = location.href.indexOf('?from=');
  if (index > -1) {
    location.href = location.href.slice(0, index);
  }
};

export const reLoad = () => {
  if (isIOS && isWechat) location.reload();
};
