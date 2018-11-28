import React from 'react';
import Copy from 'copy-to-clipboard';
import { Link } from 'react-router-dom';
import { delphyUrl } from '@/config/index';
import LoginAlert from '@/components/loginAlert/loginAlert';
import './index.less';
interface MiddleBodyProps {
  hidden: any;
}
interface MiddleBodyState {
  isAlertShow: boolean;
  isLoginShow: boolean;
}
type Props = MiddleBodyProps;
class MiddleBody extends React.Component<Props, MiddleBodyState> {
  constructor(props) {
    super(props);
    this.state = {
      isAlertShow: false,
      isLoginShow: false,
    };
  }

  componentDidMount = () => {
    // this.getToken();
  };

  getToken = callBack => {
    if (localStorage.getItem('token')) {
      if (callBack) {
        callBack();
      }
    } else {
      this.setState({ isLoginShow: true });
    }
  };

  // 点击分享触发的事件
  getUrl = () => {
    this.getToken(this.copyUrl);
  };

  copyUrl = () => {
    const username = window.localStorage.getItem('username');
    Copy(`您的好友给您发了个大红包，快来领吧！链接：${delphyUrl}me/useBag?username=${username}`);
    this.setState({
      isAlertShow: true,
    });
  };

  // 点击遮罩中的确定按钮触发
  ClickWindowCancel = () => {
    this.setState({
      isAlertShow: false,
    });
  };

  // 隐藏去登录的alert mask
  hideAlert = () => {
    this.setState({ isLoginShow: false });
  };

  render() {
    return (
      <div className="middle-body">
        {/* tost提示 */}
        {this.state.isAlertShow ? (
          <div className="clickWindow" id="inviteMethodClickWindow">
            <div className="clickWindowCover" onClick={this.ClickWindowCancel} />
            <div className="clickWindowIn">
              <p>邀请链接已复制到粘贴板，请直接发送给您的好友</p>
              <p className="lineNotMar" />
              <p onClick={this.ClickWindowCancel}>确定</p>
            </div>
          </div>
        ) : null}
        {/* 登录提示 */}
        {this.state.isLoginShow ? (
          <LoginAlert info="你尚未登录，请先登录" text="去登录" hideAlert={this.hideAlert} />
        ) : null}
        <div className="my-title">
          <img src={require('./../../../../img/my-share.jpg')} />
          <span>邀请任务</span>
        </div>
        <div className="share-items">
          <div className="share-item share-item1">
            <div className="img-bg">
              <img src={require('./../../../../img/share-icon1.jpg')} />
            </div>
            <div className="main-content">
              <p>注册送10预测币</p>
              <p>每邀1名好友注册送10预测币</p>
            </div>
            <div className="share-btn1" onClick={this.getUrl}>
              分享领奖
            </div>
          </div>
          <div className="share-item share-item2">
            <div className="img-bg">
              <img src={require('./../../../../img/share-icon2.jpg')} />
            </div>
            <div className="main-content">
              <p>预测正确3场送1DPY+20预测币</p>
              <p>邀请的好友正确3场，您将获得上述奖励</p>
            </div>
            <div className="share-btn2" onClick={this.getUrl}>
              分享领奖
            </div>
          </div>
        </div>
        {!this.props.hidden && (
          <div className="more-share">
            <Link to="/me/myinvite">
              查看更多邀请任务
              <i className="iconfont icon-DlistArrow" />
            </Link>
          </div>
        )}
      </div>
    );
  }
}

// const MiddleBody = (props) => {
//     let isAlertShow = false;
//     //点击分享触发的事件
//     const getUrl = () => {
//         Copy('邀请您参加<天算吃鸡专场>,链接：' + delphyUrl + 'escape/activity');
//     }
//     return (
//         <div className='middle-body'>
//             <div className='my-title'>
//                 <img src={require('./../../../../img/my-share.jpg')} />
//                 <span>邀请任务</span>
//             </div>
//             <div className="share-items">
//                 <div className="share-item share-item1">
//                     <div className="img-bg">
//                         <img src={require('./../../../../img/share-icon1.jpg')} />
//                     </div>
//                     <div className="main-content">
//                         <p>注册送10预测币</p>
//                         <p>每邀1名好友注册送10预测币</p>
//                     </div>
//                     <div className="share-btn1" onClick={getUrl}>
//                         分享领奖
//                     </div>
//                 </div>
//                 <div className="share-item share-item2">
//                     <div className="img-bg">
//                         <img src={require('./../../../../img/share-icon2.jpg')} />
//                     </div>
//                     <div className="main-content">
//                         <p>预测正确3场送1DPY+20预测币</p>
//                         <p>邀请的好友正确3场，您将获得上述奖励</p>
//                     </div>
//                     <div className="share-btn2">
//                         分享领奖
//                     </div>
//                 </div>
//             </div>
//             {!props.hidden &&
//                 <div className="more-share">
//                     <Link to='/me'>查看更多邀请任务 <i className="iconfont icon-DlistArrow"></i></Link>
//                 </div>
//             }
//         </div>
//     )
// }
export default MiddleBody;
