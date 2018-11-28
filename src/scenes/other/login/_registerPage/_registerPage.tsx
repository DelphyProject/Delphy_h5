import React from 'react';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { baseurl, clientType, channelId } from '../../../../config/index';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import { getNowTimestamp } from '@/utils/time';
import './_registerPage.less';

const userInfo: any = {
  username: null,
  checkCode: null,
  password: null,
  rePassword: null,
  isAgreed: null,
};
let that;
let clear = true;
interface RegisterPageState {
  timeCount: number;
  timeState: boolean;
  username: string;
  rePassword: string;
  password: string;
  checkCode: string;
  verify_key: string;
  imgSrc: string;
  verify_code: string;
  vertifyImgFlag: boolean;
  isAgreed: any;
  isImtoken: boolean;
  statisticId: any;
  channelId: string;
  isPhoneGap: boolean;
}
type Props = DispatchProp & RouteComponentProps;
class RegisterPage extends React.Component<Props, RegisterPageState> {
  constructor(props) {
    super(props);
    this.state = {
      timeCount: 60,
      timeState: true,
      username: '',
      password: '',
      rePassword: '',
      checkCode: '',
      verify_key: `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`,
      verify_code: '',
      imgSrc: '',
      vertifyImgFlag: false,
      isAgreed: false,
      isImtoken: !!window.imToken,
      statisticId: localStorage.getItem('statisticId'),
      channelId,
      isPhoneGap: !!parent.isPhoneGap,
    };
    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
    that = this;
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', that.updateInfo.bind(that), false);
    if (clear) {
      userInfo.username = null;
      userInfo.checkCode = null;
      userInfo.password = null;
      userInfo.rePassword = null;
      userInfo.isAgreed = null;
    }
  }

  componentWillMount() {
    window.addEventListener('popstate', this.updateInfo, false);
    const cId = sessionStorage.getItem('channelId');
    if (cId) {
      this.setState({
        channelId: cId,
      });
    } else {
      sessionStorage.setItem('channelId', channelId);
    }
  }

  updateInfo = () => {
    if (clear == false) {
      that.setState({
        username: userInfo.username,
        checkCode: userInfo.checkCode,
        password: userInfo.password,
        rePassword: userInfo.rePassword,
        isAgreed: userInfo.isAgreed,
      });
    }
  };

  getSource = () => {
    /*
     * 0: Unknown
     * 1: HTML 5
     * 2: Android App
     * 3: iOS App
     * 4: imToken
     */
    if (this.state.isImtoken) {
      return 4;
    }
    if (clientType == 'android') {
      return 2;
    }
    if (clientType == 'h5') {
      return 1;
    }
    return 0;
  };

  getStatisticId = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.getStatisticId(ret => {
        if (ret.code == 200) {
          this.setState({
            statisticId: ret.data,
          });
          localStorage.setItem('statisticId', ret.data);
          this.addStatistic(10202, this.state.username); // 注册成功
        }
      }),
    );
  };

  addStatistic = (actionId, name) => {
    const sId = localStorage.getItem('statisticId');
    if (sId == undefined || sId == '') return;
    const cId = sessionStorage.getItem('channelId');
    const params = {
      statisticId: sId,
      action: actionId, // 动作编号,后台配置提供
      val1: cId, // 渠道号
      phone: name,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.addStatistic(params),
    );
  };

  register() {
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
    if (!this.state.rePassword || this.state.rePassword.length <= 0) {
      showToast('确认密码不能为空', 2);
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

    if (this.state.password != this.state.rePassword) {
      showToast('两次输入的密码不一致', 2);
      return;
    }
    if (!this.state.isAgreed) {
      showToast('您未同意《天算用户协议》', 2);
      return;
    }
    showLoading('loading');
    const params: any = {};
    params.phone = this.state.username;
    params.password = this.state.password;
    params.vcode = this.state.checkCode;
    params.source = this.getSource();
    params.channel = sessionStorage.getItem('channelId');
    params.statisticId = localStorage.getItem('statisticId');
    params.action = 10202;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRegisterUser(params, ret => {
        hideLoading();
        if (ret.code == 200) {
          // if (this.state.statisticId != undefined && this.state.statisticId != '') {
          //   this.addStatistic(10202, this.state.username); // 注册成功
          // } else {
          //   this.getStatisticId();
          // }

          localStorage.setItem('username', this.state.username);
          localStorage.setItem('password', this.state.password);
          localStorage.setItem('loginState', '1');
          localStorage.setItem('token', ret.data['Session-Id']);
          localStorage.setItem('effectiveTime', getNowTimestamp() + ret.data.expires);
          localStorage.setItem('userId', ret.data.uid);
          /*
         * 更新android端的userid
          */
          if (window.delphy && window.delphy.jsToAndUserId) {
            window.delphy.jsToAndUserId(ret.data.uid);
          } else if (this.state.isPhoneGap) {
            parent.setJpushAlias(ret.data.uid);
          }

          const passwd = MD5(`${this.state.password}delphy`);
          const sessionKey = HmacSHA256(ret.data['Session-Id'], passwd);
          localStorage.setItem('sessionKey', Base64.stringify(sessionKey));
          sessionStorage.setItem('user', JSON.stringify(ret.data));
          sessionStorage.setItem('fromRegister', '1');
          showToast('注册成功', 2);
          this.props.history.push('/me/editInfo');
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  toProtocol = () => {
    this.props.dispatch({ type: fetchTypes.REGISTER_AGREEMENNT, goAgreement: true });
    /* this.props.goAgreement(); */
    this.props.history.push('/login/agreement');
  };

  toPrivacy = () => {
    this.props.history.push('/login/privacy');
  };

  getVerifyCode = () => {
    // 获取图片验证码
    const code = `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`;
    this.setState({ verify_key: code });
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

  setVerifyCode = value => {
    this.setState({ verify_code: value });
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>注册</title>
        </Helmet>
        {/* <LoginTop loginColorClass = {'registerDark loginTop'}/> */}
        <div className="registerPage">
          <form action="">
            <div className="registerM">
              <select name="">
                <option value="0">+86</option>
                {/* <option value="1">+81</option> */}
              </select>
              <input
                type="text"
                className="inputLabel"
                placeholder="请输入手机号"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.username = e.target.value;
                  this.setState({ username: e.target.value });
                }}
                value={this.state.username == '' ? this.state.username : userInfo.username}
              />
            </div>

            <div className="registerV">
              <p className="registerVOne">
                <span>验证码</span>
                <input
                  type="text"
                  className="inputLabel"
                  placeholder="请输入验证码"
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={e => {
                    userInfo.checkCode = e.target.value;
                    this.setState({ checkCode: e.target.value });
                  }}
                  value={this.state.checkCode == '' ? this.state.checkCode : userInfo.checkCode}
                />
              </p>
              {this.state.timeState == true ? (
                <input
                  type="button"
                  className="registerVTwo"
                  value="获取验证码"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.verifyingState();
                  }}
                />
              ) : (
                <div className="registerVTwo">
                  <span>{this.state.timeCount} </span>S
                </div>
              )}
            </div>

            <div className="registerP">
              <span>密码</span>
              <input
                type="password"
                className="inputLabel"
                placeholder="6-20位数字和字母组合"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.password = e.target.value;
                  this.setState({ password: e.target.value });
                }}
                value={this.state.password == '' ? this.state.password : userInfo.password}
              />
            </div>
            <div className="registerPTwo">
              <span>确认密码</span>
              <input
                type="password"
                className="inputLabel"
                placeholder="请再次输入密码"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  userInfo.rePassword = e.target.value;
                  this.setState({ rePassword: e.target.value });
                }}
                value={this.state.rePassword == '' ? this.state.rePassword : userInfo.rePassword}
              />
            </div>
            <div className="registerA">
              <input
                type="checkbox"
                value=""
                name="hobby"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={() => {
                  userInfo.isAgreed = !this.state.isAgreed;
                  this.setState({ isAgreed: !this.state.isAgreed });
                }}
                checked={this.state.isAgreed == '' ? this.state.isAgreed : userInfo.isAgreed}
              />
              <p>
                我已阅读同意{' '}
                <span
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    clear = false;
                    this.toProtocol();
                  }}>
                  《天算用户协议》
                </span>
                和
                <span
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    clear = false;
                    this.toPrivacy();
                  }}>
                  《隐私政策》
                </span>
              </p>
            </div>

            <input
              type="button"
              className="registerR"
              value="注册"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.register();
              }}
            />
          </form>
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
                {/* <img src={this.state.imgSrc} alt="" className=" vertifyimg" onClick={() => this.getVerifyCode()} /> */}
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

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         goAgreement: () => {
//             dispatch({
//                 'type': fetchTypes.REGISTER_AGREEMENNT,
//                 'goAgreement': true
//             })
//         }
//     }
// }

export default connect(mapStateToProps /* ,mapDispatchToProps */)(withRouter(RegisterPage));
