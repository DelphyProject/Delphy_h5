import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import MineTop from './top/index';
import MiddleBody from './body/index';
import MoreLink from './more/index';
import Tabs from '@/components/framework/tabs';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { isLogin } from '@/utils/tool';
import { redirect, reLoad } from '@/utils/share';
import './index.less';
interface MineProps {
  newsCount: any;
  serverData: any;
  showDownLoadBanner: any;
}
interface MineState {
  initHeight: any;
  loginState: boolean;
}
type Props = MineProps & DispatchProp;
class Mine extends React.Component<Props, MineState> {
  constructor(props) {
    super(props);
    redirect();
    this.state = {
      initHeight: 0,
      loginState: false,
    };
  }

  componentWillUnmount() {
    reLoad();
  }

  componentDidMount = () => {
    this.setState({
      initHeight: `${window.innerHeight}px`,
    });
    if (isLogin(true)) {
      this.setState({
        loginState: true,
      });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMyProfile(ret => {
          if (ret.code == 200) {
            sessionStorage.setItem('invitationLink', ret.data.invitationLink);
            sessionStorage.setItem('invitationCode', ret.data.invitationCode);
            sessionStorage.setItem('verified', ret.data.verified);
            sessionStorage.setItem('balance', ret.data.dpy);
            sessionStorage.setItem('freeze', ret.data.dpyFreeze);
            sessionStorage.setItem('nickName', ret.data.nickname);
            sessionStorage.setItem('address', ret.data.address);
            sessionStorage.setItem('kycLevel', ret.data.kycLevel);
            sessionStorage.setItem('minTransferKyc', ret.data.minTransferKyc);
            sessionStorage.setItem('minWithdrawalKyc', ret.data.minWithdrawalKyc);
          } else if (ret.code == 40005) {
            showToast('账号信息已过期，请重新登录', 2);
          }
        }),
      );
    } else {
      this.setState({
        loginState: false,
      });
    }
  };

  render() {
    const { userProfile } = this.props.serverData;
    const nullObj = {};
    return (
      <div className="mine-page" style={{ minHeight: this.state.initHeight }}>
        <Helmet>
          <title>我的</title>
        </Helmet>
        {this.state.loginState ? (
          <MineTop
            data={userProfile}
            newsCount={this.props.newsCount}
            showDownLoadBanner={this.props.showDownLoadBanner}
          />
        ) : (
          <MineTop
            data={nullObj}
            newsCount={this.props.newsCount}
            showDownLoadBanner={this.props.showDownLoadBanner}
          />
        )}
        <MiddleBody hidden={false} />
        <MoreLink />
        <Tabs />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  newsCount: store.news.newsCount,
  serverData: store.mePageState,
  showDownLoadBanner: store.showDownLoadBanner,
});

export default connect(mapStateToProps)(Mine);
