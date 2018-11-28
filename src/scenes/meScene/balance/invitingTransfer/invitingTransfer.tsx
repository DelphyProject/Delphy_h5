import React from 'react';
import { Helmet } from 'react-helmet';
import Copy from 'copy-to-clipboard';
import { invitingTransferShareIconUrl, delphyUrl } from '../../../../config';
import './invitingTransfer.less';

interface InvitingTransferProps {}
interface InvitingTransferState {
  isShow: number;
  isPhoneGap: any;
}
type Props = InvitingTransferProps;

export default class InvitingTransfer extends React.Component<Props, InvitingTransferState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: 0,
      // eslint-disable
      isPhoneGap: !!parent.isPhoneGap,
    };
  }

  invite = () => {
    const platform = localStorage.getItem('platform');
    const nickName = sessionStorage.getItem('nickName') ? sessionStorage.getItem('nickName') : '';
    if (window.delphy) {
      window.delphy.share(
        '天算，零延迟充值秘笈',
        `我是${nickName}，这里有一份DPY充值秘籍，可以秒速到账，请查收！链接：`,
        `${delphyUrl}me/inviting`,
        invitingTransferShareIconUrl,
      );
    } else if (this.state.isPhoneGap) {
      parent.share(
        '天算，零延迟充值秘笈',
        `我是${nickName}，这里有一份DPY充值秘籍，可以秒速到账，请查收！链接：`,
        `${delphyUrl}me/inviting`,
        invitingTransferShareIconUrl,
      );
    } else if (platform == 'imtoken') {
      //@ts-ignore
      webViewApi.share(
        '',
        `我是${nickName}，这里有一份DPY充值秘籍，可以秒速到账，请查收！链接：`,
        null,
      );
    } else {
      Copy(
        `我是${nickName}，这里有一份DPY充值秘籍，可以秒速到账，请查收！链接：${delphyUrl}me/inviting`,
      );
      this.setState({
        isShow: 1,
      });
    }
  };

  cancel = () => {
    this.setState({
      isShow: 0,
    });
  };

  render() {
    return (
      <div className="invitingTransfer">
        <Helmet>
          <title>如何给朋友转账</title>
        </Helmet>
        <div className="title">第一步、找到DPY转账选项</div>
        <img className="transferImg1" src={require('../../../../img/img_transfer_01.png')} />
        <div className="title">第一步、找到DPY转账选项</div>
        <img className="transferImg2" src={require('../../../../img/img_transfer_02.png')} />
        <div className="title">第一步、找到DPY转账选项</div>
        <img className="transferImg3" src={require('../../../../img/img_transfer_03.png')} />
        <div className="inviteBtn" onClick={this.invite}>
          {' '}
          邀请好友{' '}
        </div>
        {this.state.isShow ? (
          <div className="clickWindow" id="inviteMethodClickWindow">
            <div className="clickWindowCover" onClick={this.cancel} />
            <div className="clickWindowIn">
              <p>邀请链接已复制到粘贴板，请直接发送给您的好友</p>
              <p className="lineNotMar" />
              <p onClick={this.cancel}>确定</p>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
