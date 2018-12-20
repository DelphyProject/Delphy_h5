import React from 'react';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import MD5 from 'crypto-js/md5';
import Base64 from 'crypto-js/enc-base64';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { baseurl } from '../../../../config/index';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import { getNowTimestamp } from '@/utils/time';
import './_loginPage.less';
import RegisterPage from '../_registerPage/_registerPage';
// interface LoginProps {

// }
interface LoginState {
  username: any;
  password: any;
  selectValue: string;
  isLogin: boolean;
  numberVer: boolean;
  verify_code: string;
  verify_key_value: string;
  imgSrc: string;
  phone: string;
  isPhoneGap: boolean;
  isLoginStatus: number;
}
type Props = DispatchProp & RouteComponentProps;
class LoginUserPage extends React.Component<Props, LoginState> {
  constructor(props) {
    super(props);
    this.state = {
      // username: '18610131070',
      // password: '666'
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
      selectValue: '86',
      isLogin: true, // true,
      numberVer: false,
      verify_code: '',
      verify_key_value: `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`,
      // verify_key: '',
      imgSrc: '',
      phone: '',
      isPhoneGap: !!parent.isPhoneGap,
      isLoginStatus: 1,
    };
  }

  componentWillMount() {
    this.getVerifyCode();
  }

  getVerifyCode() {
    // 获取图片验证码
    const code = `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`;
    this.setState({ verify_key_value: code });
  }

  login() {
    if (!this.state.username || this.state.username.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    if (!this.state.password || this.state.password.length <= 0) {
      showToast('密码不能为空', 2);
      return;
    }
    if (!this.state.verify_code || this.state.verify_code.length <= 0) {
      showToast('验证码不能为空', 2);
      return;
    }
    showLoading('loading');
    this.props.dispatch(
      //@ts-ignore
      fetchData.getSessionId(ret => {
        if (ret.code == 200) {
          const sessionId = ret.data;
          const passwd = MD5(`${this.state.password}delphy`);
          const account = this.state.username;
          const verifyCode = this.state.verify_code;
          const verifyKey = this.state.verify_key_value;
          const sessionKey = HmacSHA256(sessionId, passwd);
          const answer = Base64.stringify(HmacSHA256(sessionId, sessionKey));
          const params: any = {};
          params.answer = answer;
          params.account = account;
          params.verify_code = verifyCode;
          params.verify_key = verifyKey;
          fetchData.fetchLoginUser(sessionId, params, ret => {
            hideLoading();
            if (ret.code == 200) {
              showToast('登录成功', 2);
              localStorage.setItem('token', ret.data['Session-Id']);
              localStorage.setItem('username', this.state.username);
              localStorage.setItem('password', this.state.password);
              localStorage.setItem('sessionKey', Base64.stringify(sessionKey));
              if (localStorage.getItem('userId') != ret.data.uid) {
                sessionStorage.setItem('changeUser', '1');
              }
              localStorage.setItem('userId', ret.data.uid);
              /*
              * 更新android端的userid
              */
              if (window.delphy && window.delphy.jsToAndUserId) {
                window.delphy.jsToAndUserId(ret.data.uid);
              } else if (this.state.isPhoneGap) {
                parent.setJpushAlias(ret.data.uid);
              }
              localStorage.setItem('loginState', '1');
              localStorage.setItem('effectiveTime', getNowTimestamp() + ret.data.expires);
              // this.props.history.push('/')
              if (this.props.location.state == 'isSharBag') {
                this.props.history.push('/find');
              } else {
                this.props.history.goBack();
              }
            } else {
              showToast(ret.msg, 2);
            }
          });
        } else {
          hideLoading();
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  getUserName(value) {
    this.setState({
      username: value,
    });
  }

  getSelectValue(value) {
    this.setState({
      selectValue: value,
    });
  }

  getPassword(value) {
    this.setState({
      password: value,
    });
  }

  setVerifyCode(value) {
    this.setState({ verify_code: value });
  }

  findPassword() {
    if (!this.state.phone || this.state.phone.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    const myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.state.phone)) {
      showToast('请输入有效的手机号码', 2);
      return;
    }
    sessionStorage.setItem('fromLogin', '1');
    sessionStorage.setItem('phone', this.state.phone);
    this.props.history.push('/me/setting/newPassword');
  }

  render() {
    return (
      <div id="loginOut">
        <Helmet>
          <title>登录</title>
        </Helmet>
        <div className="loginDark loginTop">
          <p
            className="loginDarkP"
            style={{
              color:
                sessionStorage.getItem('isLoginStatus') == '1' ||
                sessionStorage.getItem('isLoginStatus') == null
                  ? '#2e3236'
                  : '#c3c9d1',
            }}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              sessionStorage.setItem('isLoginStatus', '1');
              this.setState({
                isLoginStatus: 1,
              });
            }}>
            登录
          </p>
          <p
            className="loginDarkP"
            style={{
              color: sessionStorage.getItem('isLoginStatus') == '2' ? '#2e3236' : '#c3c9d1',
            }}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              sessionStorage.setItem('isLoginStatus', '2');
              this.setState({
                isLoginStatus: 2,
              });
            }}>
            注册
          </p>
        </div>
        {sessionStorage.getItem('isLoginStatus') == '1' ||
        sessionStorage.getItem('isLoginStatus') == null ? (
          <div className="loginPage">
            <form action="">
              <div className="loginM">
                +
                <select
                  name=""
                  value={this.state.selectValue}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={va => {
                    this.getSelectValue(va.target.value);
                  }}>
                  <option value="86">86</option>
                  {/* <option value="87">87</option>
                                <option value="88">88</option>
                                <option value="89">89</option> */}
                </select>
                <input
                  type="text"
                  placeholder="请输入手机号"
                  defaultValue={this.state.username}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={va => {
                    this.getUserName(va.target.value);
                  }}
                />
              </div>
              <div className="loginP">
                <p className="loginPOne">
                  <span>密码</span>
                  <input
                    type="password"
                    placeholder="请输入密码"
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={va => {
                      this.getPassword(va.target.value);
                    }}
                  />
                </p>

                <input
                  type="button"
                  className="loginPTwo"
                  value="找回密码"
                  readOnly={true}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({ numberVer: true });
                  }}
                />
              </div>

              <div className="loginP">
                <p className="loginPOne">
                  <span>验证码</span>
                  <input
                    type="text"
                    placeholder="输入计算结果"
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={val => {
                      this.setVerifyCode(val.target.value);
                    }}
                  />
                </p>
                <img
                  src={`${baseurl}auth/image_verify_code?verify_key=${this.state.verify_key_value}`}
                  alt=""
                  className=" vertifyimg"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.getVerifyCode()}
                />
              </div>
              <input
                className="loginL"
                type="button"
                value="登录"
                readOnly={true}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.login();
                }}
              />
            </form>
          </div>
        ) : (
          false
        )}
        {sessionStorage.getItem('isLoginStatus') == '2' ? <RegisterPage /> : false}
        {this.state.numberVer ? (
          <div id="loginPageNumberVer" className="numberVerPages">
            <div
              className="numberVerCover"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({ numberVer: false });
              }}
            />
            <div className="numberVer">
              <p>
                <input
                  type="text"
                  placeholder="请输入手机号码"
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={val => {
                    this.setState({ phone: val.target.value });
                  }}
                />
              </p>
              <div className="lineNotMar" />
              <pre
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.findPassword();
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
  serverData: store.loginUserState,
});

export default connect(mapStateToProps)(LoginUserPage);
withRouter(LoginUserPage);
