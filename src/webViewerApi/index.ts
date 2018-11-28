const { imToken, web3 } = window;

let isIMToken = false;
const platform = localStorage.getItem('platform');
// let thisIsImToken=false
if (platform == 'imtoken') {
  isIMToken = true;
} else {
  window.addEventListener('sdkReady', () => {
    // run your code
    localStorage.setItem('platform', 'imtoken');
    isIMToken = true;
  });
}

function callAPI(...args) {
  if (!isIMToken) {
    alert('当前浏览器不支持此功能，请使用imtoken打开Delphy Dapp');
    return;
  }
  return imToken.callAPI(...args);
}

export function closeDApp() {
  callAPI('navigator.closeDapp');
}

export function goback() {
  callAPI('navigator.goBack');
}

export function toggleNavbar() {
  callAPI('navigator.toggleNavbar');
}

export function myAlert() {
  callAPI('native.alert', 'winner winner, chicken dinner！');
}

export function confirm() {
  callAPI(
    'native.confirm',
    {
      title: 'quick question',
      message: 'is imToken the best useful wallet?',
      cancelText: 'no',
      confirmText: 'yes',
    },
    (err, result) => {
      if (err) {
        //
      } else {
        //
      }
    },
  );
}

export function toast() {
  callAPI('native.toastInfo', '123456789');
}

export function showLoading() {
  callAPI('native.showLoading', 'loading！');
  setTimeout(() => {
    callAPI('native.hideLoading');
  }, 3000);
}

export function setClipboard() {
  callAPI('native.setClipboard', 'are you ok?');
}

export function share(title, msg, url) {
  callAPI(
    'native.share',
    {
      title,
      message: msg,
      url: url || location.href,
    },
    (err, ret) => {
      if (err) {
        callAPI('native.alert', 'user not share');
      } else {
        //
      }
    },
  );
}

export function scanQRCode() {
  callAPI('native.scanQRCode', (err, ret) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', ret.toString());
    }
  });
}

export function setCalEvent() {
  callAPI(
    'native.setCalEvent',
    {
      title: 'test save event',
      settings: {
        notes: 'go to china this night',
        startDate: '2017-09-28T19:42:00.000Z',
        endDate: '2017-09-28T09:19:44.000Z',
        alarms: [
          {
            date: -1, // ios only
          },
        ],
      },
    },
    (err, id) => {
      if (err) {
        callAPI('native.alert', err.toString());
      } else {
        callAPI('native.alert', id.toString());
      }
    },
  );
}

export function tokenPay() {
  const params = {
    contractAddress: '0x0000000000000000000000000000000000000000',
    to: '0x0fa38abec02bd4dbb87f189df50b674b9db0b468',
    from: web3.eth.defaultAccount,
    value: '1250000000000000',
    orderInfo: 'buy a cup of coffee',
    customizable: true,
  };

  callAPI('transaction.tokenPay', params, (err, hash) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', hash.toString());
    }
  });
}

export function getCurrentAccount() {
  callAPI('user.getCurrentAccount', (err, address) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', address.toString());
    }
  });
}

export function getAccountList() {
  callAPI('user.getAccountList', (err, list) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', list.toString());
    }
  });
}

export function getAssetTokens() {
  callAPI('user.getAssetTokens', (err, assetTokens) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', assetTokens.map(t => `${t.symbol} `).toString());
    }
  });
}

export function showAccountSwitch() {
  callAPI(
    'user.showAccountSwitch',
    {
      contractAddress: '0x0000000000000000000000000000000000000000',
    },
    (err, address) => {
      if (err) {
        callAPI('native.alert', err.toString());
      } else {
        callAPI('native.alert', address.toString());
      }
    },
  );
}

export function getContacts() {
  callAPI('user.getContacts', (err, contacts) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', contacts.toString());
    }
  });
}

export function getProfile() {
  callAPI('user.getProfile', (err, profile) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', profile.toString());
    }
  });
}

export function getCurrentLanguage() {
  callAPI('device.getCurrentLanguage', (err, language) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', language.toString());
    }
  });
}

export function getCurrentCurrency() {
  callAPI('device.getCurrentCurrency', (err, currency) => {
    if (err) {
      callAPI('native.alert', err.toString());
    } else {
      callAPI('native.alert', currency.toString());
    }
  });
}

export function selectPicture(callBack) {
  callAPI('native.selectPicture', { maxWidth: 400, maxHeight: 400 }, (err, ret) => {
    if (err) {
      // alert(err.message)
      // callBack(err)
    } else {
      callBack(ret.data);
    }
  });
}

export default {
  closeDApp,
  goback,
  toggleNavbar,
  myAlert,
  confirm,
  toast,
  setClipboard,
  share,
  scanQRCode,
  setCalEvent,
  tokenPay,
  getCurrentAccount,
  getAccountList,
  getAssetTokens,
  showAccountSwitch,
  getContacts,
  getProfile,
  getCurrentLanguage,
  getCurrentCurrency,
  selectPicture,
};
