import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import MD5 from 'crypto-js/md5';
import * as fetchAction from '@/redux/actions/actions_fetchServerData';
import LoginAlert from '@/components/loginAlert/loginAlert';
import { baseurl, channelId } from '@/config/index';
import { getNowTimestamp } from '@/utils/time';
import './index.less';
interface ActivityBagProps {
  serverData: any;
  marketPageState: any;
}
interface ActivityBagState {
  height: string;
  isShow: boolean;
  phoneNumber: string;
  timeCount: number;
  isNewUser: boolean;
  vertifyImgFlag: boolean;
  verify_code: string;
  timeState: boolean;
  verify_key: string;
  imgSrc: string;
  checkCode: string;
  password: string;
}
type Props = ActivityBagProps & DispatchProp & RouteComponentProps;
class ActivityBag extends React.Component<Props, ActivityBagState> {
  time: any;
  constructor(props) {
    super(props);
    this.state = {
      height: '0px',
      isShow: false,
      phoneNumber: '',
      timeCount: 60,
      isNewUser: true,
      vertifyImgFlag: false,
      verify_code: '',
      timeState: true,
      verify_key: `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`,
      imgSrc: '',
      checkCode: '',
      password: '',
    };
    this.time = null;
  }

  componentWillMount() {
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
      fetchAction.getStatisticId(ret => {
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
    const phone = this.state.phoneNumber;
    const params = {
      statisticId: sId,
      action: actionId, // 动作编号,后台配置提供
      phone: phone || '',
      val1: channelId,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchAction.addStatistic(params, ret => {
        if (ret.code == 200) {
          return;
        }
      }),
    );
  };

  componentDidMount() {
    this.setState({
      height: `${window.innerHeight}px`,
    });
  }

  getIcon = () => {
    if (this.testNum(this.state.phoneNumber)) {
      this.props.dispatch(
        //@ts-ignore
        fetchAction.fetchMyByPhone(this.state.phoneNumber, null, res => {
          if (res.code == 200) {
            if (res.data == null) {
              this.getVerifyCode();
              this.setState({
                // isShow: true,
                isNewUser: true,
                vertifyImgFlag: true,
              });
              // this.thisTime();
              // this.getCheckCode();
            } else {
              this.setState({
                isShow: true,
                isNewUser: false,
              });
            }
          }
        }),
      );
    }
  };

  hiddenMask = () => {
    this.setState({
      isShow: false,
    });
    this.thisTime(true);
  };

  telInput = val => {
    this.setState({
      phoneNumber: val.target.value,
    });
  };

  thisTime = flag => {
    if (flag) {
      clearInterval(this.time);
      this.setState({
        timeCount: 60,
      });
    } else {
      this.time = setInterval(() => {
        if (this.state.timeCount <= 1) {
          clearInterval(this.time);
          this.setState({
            timeState: true,
            timeCount: 0,
          });
        } else {
          this.setState({
            timeCount: this.state.timeCount - 1,
          });
        }
      }, 1000);
    }
  };

  testNum = val => {
    if (!val || val.length <= 0) {
      showToast('手机号不能为空', 2);
      return false;
    }
    const myreg = /^(((13[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    if (!myreg.test(val)) {
      showToast('请输入有效的手机号码', 2);
      return false;
    }
    return true;
  };

  // 隐藏去登录的alert mask
  hideAlert = () => {
    this.setState({ isShow: false });
  };

  getVerifyCode = () => {
    // 获取图片验证码
    const code = `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`;
    this.setState({ verify_key: code });
  };

  checkImageCode = () => {
    const params = { verify_key: this.state.verify_key, verify_code: this.state.verify_code };
    this.props.dispatch(
      //@ts-ignore
      fetchAction.fetchGetCheckCode1(this.state.phoneNumber, params, val => {
        if (val.code == 200) {
          this.setState({
            timeState: false,
            vertifyImgFlag: false,
            isShow: true,
          });
          this.thisTime(false);
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  setVerifyCode = value => {
    this.setState({ verify_code: value });
  };

  register = () => {
    if (!this.state.phoneNumber || this.state.phoneNumber.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    const myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.state.phoneNumber)) {
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
    params.phone = this.state.phoneNumber;
    params.password = this.state.password;
    params.type = '10019';
    params.vcode = this.state.checkCode;
    params.inviteCode = '4aeN';
    params.channel = sessionStorage.getItem('channelId');
    params.statisticId = localStorage.getItem('statisticId');
    params.action = 10302;
    this.props.dispatch(
      //@ts-ignore
      fetchAction.fetchRegisterUser(params, ret => {
        hideLoading();
        if (ret.code == 200) {
          localStorage.setItem('username', this.state.phoneNumber);
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
          sessionStorage.setItem('isNewUserShow', 'true');
          sessionStorage.setItem('rewardAmount', '30');
          showToast('恭喜您注册成功！', 2);
          setTimeout(() => {
            this.props.history.push('/find');
          }, 2500);
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  };

  componentWillUnmount = () => {
    this.setState = () => {
      return;
    };
  };

  inputCheckCode = e => {
    this.setState({ checkCode: e.target.value });
  };

  inputPassword = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    const showAlert = flag => {
      if (flag) {
        return (
          <div
            className="alert-warp"
            // tslint:disable-next-line:jsx-no-lambda
            onTouchMove={e => {
              e.preventDefault();
            }}>
            <div className="bg-mask" onClick={this.hiddenMask} />
            <div className="input-box">
              <p className="alert-title">注册领取30预测币</p>
              <p className="alert-info1">
                已发送验证码到
                <span>{this.state.phoneNumber}</span>
              </p>
              <div className="tel-code">
                <input
                  placeholder="6位短信验证码"
                  type="tel"
                  maxLength={6}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={e => this.inputCheckCode(e)}
                />
                <span>{this.state.timeCount}秒</span>
              </div>
              <div className="my-code">
                <span>密码</span>
                <input
                  placeholder="6-20位数字和字母组合"
                  type="password"
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={e => this.inputPassword(e)}
                  maxLength={20}
                />
              </div>
              <div className="submit-btn" onClick={this.register}>
                立即领取
              </div>
            </div>
          </div>
        );
      }
      return (
        <LoginAlert
          info="您已经是天算老用户了"
          text="去登录"
          hideAlert={this.hideAlert}
          isSharBag={1}
        />
      );
    };
    return (
      <div className="activity-bag-warp" style={{ minHeight: this.state.height }}>
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
                  // this.getCheckCode();
                  this.checkImageCode();
                }}>
                确定
              </pre>
            </div>
          </div>
        ) : (
          false
        )}
        <div className="bg-color" />
        <div className="logo-warp">
          <img src={require('@/img/redBag/dph-logo.png')} />
          <span className="line-style">|</span>
          <span>人算不如天算</span>
        </div>
        <div className="up-warp">
          <div className="golden-img">
            <img src={require('@/img/redBag/golden2.png')} />
          </div>
          <input
            className="phone-input"
            maxLength={11}
            type="tel"
            placeholder="请输入您的手机号码领取福利"
            // tslint:disable-next-line:jsx-no-lambda
            onChange={val => {
              this.telInput(val);
            }}
          />
          <div className="get-btn" onClick={this.getIcon}>
            立即领取
          </div>
          <p className="info-title">说明</p>
          <p>
            1.活动期间，每个新用户通过此链接注册天算后，即可免费获得30预测币，预测币可以参与天算预测（限只赢不输玩法），获取更多天算DPY。
          </p>
          <p>2.若发现有任何不正当行为，例如造假、刷量等，将取消对应用户的相关奖励。</p>
          <p>3.本功能最终解释权归天算基金会所有。</p>
        </div>
        {this.state.isShow ? showAlert(this.state.isNewUser) : null}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.mySharePage,
  marketPageState: store.marketPageState,
});
export default connect(mapStateToProps)(withRouter(ActivityBag));
