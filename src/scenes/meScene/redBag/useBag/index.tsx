import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import * as fetchAction from '@/redux/actions/actions_fetchServerData';
import './index.less';

interface UseBagProps {
  serverData: any;
}
interface UseBagState {
  height: string;
}
type Props = UseBagProps & DispatchProp & RouteComponentProps;
class UseBag extends React.Component<Props, UseBagState> {
  username: string;
  constructor(props) {
    super(props);
    this.state = {
      height: '0px',
    };
    this.username = '';
  }

  componentWillMount() {
    const url = window.location.search;
    const theRequest = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      this.username = theRequest['username'];
    }
    // const { href } = window.location;
    this.props.dispatch(
      //@ts-ignore
      fetchAction.fetchMyByPhone(this.username, null, res => {
        console.log(res);
        if (res.code == 200 && res.data.invitationCode) {
          window.sessionStorage.setItem('invitationCode', res.data.invitationCode);
        }
      }),
    );
  }

  componentDidMount() {
    this.setState({
      height: `${window.innerHeight}px`,
    });
  }

  render() {
    const avactor = this.props.serverData.data ? this.props.serverData.data.avatar : null;
    const nickname = this.props.serverData.data ? this.props.serverData.data.nickname : null;
    return (
      <div className="use-bag-warp" style={{ minHeight: this.state.height }}>
        <div className="logo-warp">
          <img src={require('@/img/redBag/dph-logo.png')} />
          <span className="line-style">|</span>
          <span>人算不如天算</span>
        </div>
        <div className="up-warp">
          <div className="golden-img">
            <img src={require('@/img/redBag/golden.png')} />
          </div>
          <div className="head-img">
            <img src={avactor || require('@/img/my_photo_none.png')} />
          </div>
          <p className="invite-name">{nickname || ''}</p>
          <p className="more-info">
            {nickname || ''}
            给您发了一个红包
          </p>
          <div className="open-img">
            <img
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push('/me/shareBag');
              }}
              src={require('@/img/redBag/use.png')}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.mySharePage,
});
export default connect(mapStateToProps)(withRouter(UseBag));
