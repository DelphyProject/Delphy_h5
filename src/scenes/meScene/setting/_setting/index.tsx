import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import './setting.less';

interface ProfileEditProps {}
interface ProfileEditState {
  el: string;
  signOut: boolean;
  isPhoneGap: any;
}
type Props = ProfileEditProps & RouteComponentProps;

class ProfileEdit extends React.Component<Props, ProfileEditState> {
  constructor(props) {
    super(props);
    this.state = {
      el: 'kajwheiufb@abc.com',
      signOut: false,
      isPhoneGap: !!parent.isPhoneGap,
    };
  }

  render() {
    let version = null;
    if (window.delphy) {
      if (window.delphy.getAppVersion) {
        version = window.delphy.getAppVersion();
      }
    } else if (parent) {
      if (parent.isPhoneGap) {
        version = parent.getPhonegapAppVersion();
      }
    }
    return (
      <div className="settingPage">
        {/* <Link to='/me/setting/newEmail'>
                    <div>
                        <h4>绑定邮箱</h4>
                        <p>kajwheiufb@abc.com<span className="icon-public_icon_back_normal"></span></p>
                    </div>
                </Link> */}
        <Link to="/me/setting/newPassword">
          <div className="topItem">
            <p>修改密码</p>
            <span className="icon-public_narrow_list_m iconfontMarket back" />
          </div>
          <p className="topItemBorder" />
        </Link>

        {version != null ? (
          <div className="topItem Edition">
            <p>版本号</p>
            <span className="back">{version}</span>
          </div>
        ) : (
          false
        )}

        <div
          className="signOut"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            this.setState({
              signOut: true,
            });
          }}>
          退出账户
        </div>
        {/* <Link to='/me/setting/test'>上拉下拉测试</Link>

                <Link to='/testImtokenAPI'>Imtoken测试</Link>
                <Link to="/me/transactionDetailPage">tree</Link> */}
        {this.state.signOut ? (
          <div className="sign0utCoverPage">
            <div className="sign0utCover" />
            <div className="sign0utCoverIn">
              <p>确认退出</p>
              <div className="lineNotMar" />
              <ul>
                <li
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    const channelId = sessionStorage.getItem('channelId');
                    const platform = localStorage.getItem('platform');
                    const sId = localStorage.getItem('statisticId');
                    const isShowTipTag = localStorage.getItem('isShowTip');
                    localStorage.clear();

                    sessionStorage.clear();
                    if (channelId) {
                      sessionStorage.setItem('channelId', channelId);
                    }
                    if (sId) {
                      localStorage.setItem('statisticId', sId);
                    }
                    if (platform) {
                      localStorage.setItem('platform', platform);
                    }
                    if (isShowTipTag) {
                      localStorage.setItem('isShowTip', isShowTipTag);
                    }
                    this.props.history.goBack();
                  }}>
                  确定
                </li>
                <li
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({
                      signOut: false,
                    });
                  }}>
                  取消
                </li>
              </ul>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}

export default withRouter(ProfileEdit);
