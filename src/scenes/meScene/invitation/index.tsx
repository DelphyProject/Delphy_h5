import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import Copy from 'copy-to-clipboard';
import QrCode from '../../../components/QRcode';
import { delphyUrl } from '../../../config/index';
import './invitation.less';

interface InvitePageProps {
  serverData: any;
}
interface InvitePageState {
  url: string;
  iCode: string | null;
}
interface TheRequest {
  ICode: string;
}
type Props = InvitePageProps & DispatchProp;

class InvitePage extends React.Component<Props, InvitePageState> {
  h: string;
  constructor(props) {
    super(props);
    this.h = window.delphy ? delphyUrl : `${window.location.protocol}//${window.location.host}/`;
    this.state = {
      url: `${this.h}me/invitationRegister/${sessionStorage.getItem('invitationCode')}`,
      iCode: sessionStorage.getItem('invitationCode'),
    };
  }

  componentDidMount() {
    const url = window.location.search;
    const theRequest = {} as TheRequest;
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      if (theRequest.ICode != undefined && theRequest.ICode != '') {
        this.setState({
          url: `${this.h}me/invitationRegister/${theRequest.ICode}`,
          iCode: theRequest.ICode,
        });
      }
    }
  }

  copyAddressEvent = () => {
    const nickName = sessionStorage.getItem('nickName');
    const name = nickName || '';
    const code = this.state.iCode ? this.state.iCode : '';
    const msg = `我是${name}，邀请您加入天算参与预测，只赢不输哦~邀请码：${code}。百万大奖等咱们来拿，赶快加入哦～${
      this.state.url
    }`;
    Copy(msg);
    showToast('拷贝成功', 2);
  };

  render() {
    const inviteCode = this.state.iCode;
    const codeOne = inviteCode ? inviteCode[0] : '';
    const codeTwo = inviteCode ? inviteCode[1] : '';
    const codeThird = inviteCode ? inviteCode[2] : '';
    const codeFour = inviteCode ? inviteCode[3] : '';

    return (
      <div>
        <Helmet>
          <title>邀请</title>
        </Helmet>
        <div className="invitePage">
          <div className="inviteTop">
            <p className="inviteelementOne">邀请您的好友加入Delphy</p>
            <div className="inviteelementTwo">
              <p />
              <p />
              <p />
            </div>
            <p className="inviteelementThree">您的邀请码</p>
            <div className="inviteelementFour">
              <p>{codeOne}</p>
              <p>{codeTwo}</p>
              <p>{codeThird}</p>
              <p>{codeFour}</p>
            </div>
            <div className="inviteelementFive" onClick={this.copyAddressEvent}>
              复制
            </div>
            <p className="inviteelementSix">每邀请一位用户，即可获得10DPY解锁金额</p>
          </div>
          <QrCode url={this.state.url} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(InvitePage);
