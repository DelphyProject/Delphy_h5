import React from 'react';
import { Button, WingBlank, WhiteSpace } from 'antd-mobile';
import { connect } from 'react-redux';
import webViewApi from '../../webViewerApi';

class TxRecordPage extends React.Component {
  handleTestShareBtnClick = () => {
    webViewApi.share('test', 'test message', 'https://www.baidu.com');
  };

  render() {
    return (
      <WingBlank>
        <Button type="primary" onClick={webViewApi.closeDApp}>
          closeDapp
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.goback}>
          goBack
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.toggleNavbar}>
          toggleNavbar
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.myAlert}>
          alert
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.confirm}>
          confirm
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.toast}>
          toastInfo
        </Button>
        <WhiteSpace />
        {/* <Button
          type="primary"
          onClick={() => {
            webViewApi.showLoading();
          }}>
          showLoading
        </Button>
        <WhiteSpace /> */}
        <Button type="primary" onClick={webViewApi.setClipboard}>
          setClipboard
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={this.handleTestShareBtnClick}>
          share
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.scanQRCode}>
          scanQRCode
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.setCalEvent}>
          setCalEvent
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.tokenPay}>
          transaction.tokenPay
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getCurrentAccount}>
          user.getCurrentAccount
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getAccountList}>
          user.getAccountList
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getAssetTokens}>
          user.getAssetTokens
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.showAccountSwitch}>
          user.showAccountSwitch
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getContacts}>
          user.getContacts
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getProfile}>
          user.getProfile
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getCurrentLanguage}>
          device.getCurrentLanguage
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.getCurrentCurrency}>
          device.getCurrentCurrency
        </Button>
        <WhiteSpace />
        <Button type="primary" onClick={webViewApi.selectPicture}>
          device.selectPicture
        </Button>
        <WhiteSpace />
      </WingBlank>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.Transaction_recordState,
});
export default connect(mapStateToProps)(TxRecordPage);
