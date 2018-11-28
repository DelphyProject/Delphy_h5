import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { Helmet } from 'react-helmet';
import { connect, DispatchProp } from 'react-redux';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import { baseurl, channelId } from '../../../../config/index';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import './invitationRegister.less';
import { getNowTimestamp } from '@/utils/time';

const userInfo: any = {
  username: null,
  checkCode: null,
  password: null,
};
let inviteCode;
interface InvitationRegesterState {
  timeCount: number;
  timeState: boolean;
  username: string;
  password: string;
  checkCode: string;
  verify_key: string;
  verify_code: string;
  imgSrc: string;
  vertifyImgFlag: boolean;
}
type Props = RouteComponentProps & DispatchProp;
class InvitationRegester extends React.Component<Props, InvitationRegesterState> {
  constructor(props) {
    super(props);
    this.state = {
      timeCount: 60,
      timeState: true,
      username: '',
      password: '',
      checkCode: '',
      verify_key: `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`,
      verify_code: '',
      imgSrc: '',
      vertifyImgFlag: false,
    };
  }

  componentWillMount() {
    const invitationUrl = this.props.location.pathname;
    const index = invitationUrl.lastIndexOf('/');
    inviteCode = invitationUrl.slice(index + 1);
    const statisticId = localStorage.getItem('statisticId');
    if (statisticId != undefined && statisticId != '') {
      this.addStatistic(10301); // 打开邀请注册
    } else {
      this.getStatisticId();
    }
  }

  getStatisticId = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.getStatisticId(ret => {
        if (ret.code == 200) {
          localStorage.setItem('statisticId', ret.data);
          this.addStatistic(10301); // 第一次打开h5
        }
      }),
    );
  };

  addStatistic = actionId => {
    const sId = localStorage.getItem('statisticId');
    if (sId == undefined || sId == '') return;
    const phone = this.state.username;
    const params = {
      statisticId: sId,
      action: actionId, // 动作编号,后台配置提供
      phone: phone || '',
      val1: channelId,
    };
    //@ts-ignore
    this.props.dispatch(fetchData.addStatistic(params));
  };

  register = () => {
    if (!this.state.username || this.state.username.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    const myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.state.username)) {
      showToast('请输入有效的手机号码', 2);
      return;
    }
    if (!this.state.checkCode || this.state.checkCode.length <= 0) {
      showToast('验证码不能为空', 2);
      return;
    }
    if (!this.state.password || this.state.password.length <= 0) {
      showToast('密码不能为空', 2);
      return;
    }
    const reg = /^[A-Za-z0-9]{6,20}$/;
    const reg1 = /[a-zA-Z]+/;
    const reg2 = /[0-9]+/;
    if (!reg.test(this.state.password)) {
      showToast('密码必须是6-20位字母和数字组合', 2);
      return;
    }
    if (!reg1.test(this.state.password)) {
      showToast('密码必须是6-20位字母和数字组合', 2);
      return;
    }
    if (!reg2.test(this.state.password)) {
      showToast('密码必须是6-20位字母和数字组合', 2);
      return;
    }
    showLoading('loading');
    const params: any = {};
    params.phone = this.state.username;
    // const enCodepasswd = Base64.stringify(MD5(`${this.state.password}delphy`));
    params.password = this.state.password;
    params.vcode = this.state.checkCode;
    params.inviteCode = inviteCode;
    params.channel = sessionStorage.getItem('channelId');
    params.statisticId = localStorage.getItem('statisticId');
    params.action = 10302;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRegisterUser(params, ret => {
        hideLoading();
        if (ret.code == 200) {
          // this.addStatistic(10302); // 注册成功
          localStorage.setItem('username', this.state.username);
          localStorage.setItem('password', this.state.password);
          localStorage.setItem('loginState', '1');
          localStorage.setItem('token', ret.data['Session-Id']);
          localStorage.setItem('effectiveTime', getNowTimestamp() + ret.data.expires);
          localStorage.setItem('userId', ret.data.uid);
          const passwd = MD5(`${this.state.password}delphy`);
          const sessionKey = HmacSHA256(ret.data['Session-Id'], passwd);
          localStorage.setItem('sessionKey', Base64.stringify(sessionKey));
          sessionStorage.setItem('user', JSON.stringify(ret.data));
          sessionStorage.setItem('fromRegister', '1');
          showToast('注册成功', 2);
          this.props.history.push('/me/intiteSuccess');
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  };

  getVerifyCode = () => {
    // 获取图片验证码
    const code = `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`;
    this.setState({ verify_key: code });
  };

  setVerifyCode = value => {
    this.setState({ verify_code: value });
  };

  getCheckCode = () => {
    const myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.state.username)) {
      showToast('请输入有效的手机号码', 2);
      return;
    }
    if (!this.state.verify_code || this.state.verify_code.length <= 0) {
      showToast('图片验证码不能为空', 2);
      return;
    }
    const params = { verify_key: this.state.verify_key, verify_code: this.state.verify_code };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchGetCheckCode1(this.state.username, params, val => {
        if (val.code == 200) {
          this.setState({
            timeState: false,
            vertifyImgFlag: false,
          });
          this._timer();
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  // tslint:disable-next-line:variable-name
  _timer = () => {
    const time = setInterval(() => {
      if (this.state.timeCount <= 1) {
        clearInterval(time);
        this.setState({
          timeState: true,
          timeCount: 60,
        });
      } else {
        this.setState({
          timeCount: this.state.timeCount - 1,
        });
      }
    }, 1000);
  };

  verifyingState = () => {
    if (!this.state.username || this.state.username.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    this.setState({ vertifyImgFlag: true });
    this.getVerifyCode();
  };

  render() {
    return (
      <div className="invitationRegester">
        <Helmet>
          <title>用户注册</title>
        </Helmet>
        <div className="mainPage">
          <img src={require('./../../../../img/headImg.png')} />
          <div className="info">
            <div className="infoItem">
              <span className="iconfont ic_phone icon-ic_phone" />
              <input
                className="inputItem"
                placeholder="请输入手机号"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.username = e.target.value;
                  this.setState({ username: e.target.value });
                }}
                value={this.state.username == '' ? this.state.username : userInfo.username}
              />
            </div>
            <div className="infoItem infoItemCode">
              <span className="iconfont ic_password icon-ic_password" />
              <input
                className="inputItem"
                placeholder="短信验证码"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.checkCode = e.target.value;
                  this.setState({ checkCode: e.target.value });
                }}
              />
              {this.state.timeState == true ? (
                <p
                  className="checkCode"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.verifyingState();
                  }}>
                  获取验证码
                </p>
              ) : (
                <p className="checkCode">{this.state.timeCount} S</p>
              )}
            </div>
            <div className="infoItem">
              <span className="iconfont icon-me_icon_wallet" />
              <input
                className="inputItem"
                type="password"
                placeholder="输入密码"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.password = e.target.value;
                  this.setState({ password: e.target.value });
                }}
                value={this.state.password == '' ? this.state.password : userInfo.password}
              />
            </div>
          </div>
          <button
            type="button"
            className="registerBtn"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.register();
            }}>
            注册
          </button>
          <div className="dpyBox">
            <img src={require('./../../../../img/dpyImg.png')} />
            <p>扫描二维码下载天算APP</p>
            <p>百万大奖等你拿</p>
            <p>(目前只支持安卓版本)</p>
          </div>
        </div>
        {this.state.vertifyImgFlag ? (
          <div className="numberVerPage">
            <div
              className="numberVerCover"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({ vertifyImgFlag: false });
              }}
            />
            <div className="numberVer">
              <p>
                <img
                  src={`${baseurl}auth/image_verify_code?verify_key=${this.state.verify_key}`}
                  alt=""
                  className=" vertifyimg"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.getVerifyCode()}
                />
              </p>
              <p>
                <input
                  type="text"
                  placeholder="请输入计算结果"
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={val => {
                    this.setVerifyCode(val.target.value);
                  }}
                />
              </p>
              <div className="lineNotMar" />
              <pre
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.getCheckCode();
                }}>
                确定
              </pre>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  marketPageState: store.marketPageState,
});
export default connect(mapStateToProps /* ,mapDispatchToProps */)(withRouter(InvitationRegester));
