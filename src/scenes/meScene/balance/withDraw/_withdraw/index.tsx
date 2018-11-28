import { showToast } from '@/utils/common';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import './withdraw.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '../../../../../redux/actions/actions_fetchServerData';
import { isLogin } from '../../../../../utils/tool';

interface WithdrawProps {
  serverData: any;
}
interface WithdrawState {
  timeCount: number;
  rechargeOuterState: boolean;
  amount: any;
  cointype: number;
  address: any;
  password: string;
  withdrawWindowstate: boolean;
  fee: number;
  verify_code: string;
  timeState: boolean;
}
type Props = WithdrawProps & DispatchProp & RouteComponentProps;

class Withdraw extends React.Component<Props, WithdrawState> {
  constructor(props) {
    super(props);
    this.state = {
      timeCount: 60,
      rechargeOuterState: false,
      amount: '',
      cointype: 1, // 1 dpy,2 eth,3 btc
      //@ts-ignore
      address: window.imToken ? web3.eth.defaultAccount : '',
      password: '',
      withdrawWindowstate: false,
      fee: 0,
      verify_code: '',
      timeState: true,
    };

    //@ts-ignore
    if (typeof web3 == 'undefined') {
      window.addEventListener('sdkReady', () => {
        //@ts-ignore
        this.setState({ address: web3.eth.defaultAccount });
      });
    }
  }

  getCheckCode = () => {
    if (!this.state.password || this.state.password.length <= 0) {
      showToast('密码不能为空', 2);
      return;
    }
    this.props.dispatch(
      //@ts-ignore
      fetchData.applyMyVcode(null, val => {
        if (val.code == 200) {
          this.setState({
            timeState: false,
          });

          this.thisTimer();
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  thisTimer = () => {
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

  setVerifyCode(value) {
    this.setState({ verify_code: value });
  }

  withDraw() {
    if (!isLogin(true)) {
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
    const params: any = {};
    params.amount = this.state.amount;
    params.coinType = this.state.cointype;
    params.address = this.state.address;
    params.vcode = this.state.verify_code;
    // params.password = this.state.password
    let passwd = MD5(`${this.state.password}delphy`);
    passwd = Base64.stringify(passwd);
    params.password = passwd;
    this.props.dispatch(
      //@ts-ignore
      fetchData.withDraw(params, result => {
        this.setState({
          rechargeOuterState: false,
        });
        if (result.code == 200) {
          this.setState({
            withdrawWindowstate: true,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  render() {
    return (
      <div className="withdrawPage">
        <div className="withdraw money">
          <p>提现金额</p>
          <input
            type="number"
            // tslint:disable-next-line:jsx-no-lambda
            onInput={(e: any) => {
              e.target.value = e.target.value.replace(/[^0-9.]+/, '');
            }}
            placeholder="请输入提现金额"
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => {
              e.target.value
                ? this.setState({
                    amount: e.target.value,
                    fee: 2,
                  })
                : this.setState({
                    amount: e.target.value,
                    fee: 0,
                  });
            }}
          />
        </div>
        <p className="moneyOnline">
          <span>
            手续费:
            {this.state.fee}
            DPY/次
          </span>
        </p>
        <div className="withdraw address">
          <p>提现地址</p>

          <input
            type="text"
            value={this.state.address}
            placeholder="请输入提现地址"
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => {
              this.setState({
                address: e.target.value,
              });
            }}
          />
        </div>
        <p className="withdrawPrompt">
          ·仅支持对ERC20地址进行提现，提现中产生的GAS费用我们将转化成DPY替您扣除（转化过程将产生少量额外费用）
        </p>
        <p className="withdrawPrompt">·交易过程将耗费一定时间，请您耐心等待。</p>
        <input
          type="button"
          className="withdrawBtn font_weight"
          value="确认提现"
          readOnly={true}
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (!this.state.amount || this.state.amount.length <= 0) {
              showToast('金额不能为空', 2);
              return;
            }
            if (this.state.amount - 0 <= 0) {
              showToast('请输入正确的金额', 2);
              return;
            }
            const patrn = /^[0-9]*$/;
            if (!patrn.test((this.state.amount - 0).toString())) {
              showToast('提现金额必须为正整数', 2);
              return;
            }

            if (!this.state.address || this.state.address.length <= 0) {
              showToast('地址不能为空', 2);
              return;
            }
            const adl = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{42}$/;
            if (!adl.test(this.state.address)) {
              showToast('请输入正确的ERC20地址', 2);
              return;
            }
            this.setState({
              rechargeOuterState: true,
            });
          }}
        />
        {this.state.rechargeOuterState == true ? (
          <div className="rechargeOuter">
            <div
              className="rechargeCover"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  rechargeOuterState: false,
                });
              }}
            />
            <div className="rechargeMode">
              <div className="rechargeModeHead">
                <span
                  className="iconfontMarket  icon-public_icon_windowcl"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({
                      rechargeOuterState: false,
                    });
                  }}
                />
                <p>提现确认</p>
                <span
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.withDraw();
                  }}>
                  确定
                </span>
              </div>
              <div className="rechargeModeinner">
                <div className="inputItem">
                  <span className="iconfont ic_password icon-ic_password" />
                  <div className="rightItems">
                    <input
                      type="password"
                      placeholder="请输入密码"
                      // tslint:disable-next-line:jsx-no-lambda
                      onChange={e => {
                        this.setState({
                          password: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="inputItem">
                  <span className="iconfont icon-ic_verification" />
                  <div className="rightItems2">
                    <input
                      type="password"
                      placeholder="请输入验证码"
                      // tslint:disable-next-line:jsx-no-lambda
                      onChange={e => {
                        this.setState({
                          verify_code: e.target.value,
                        });
                      }}
                    />
                    <div>
                      {this.state.timeState == true ? (
                        <p
                          className="checkCode"
                          // tslint:disable-next-line:jsx-no-lambda
                          onClick={() => {
                            this.getCheckCode();
                          }}>
                          获取验证码
                        </p>
                      ) : (
                        <div className="registerVTwo">
                          <span>{this.state.timeCount}S </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        {this.state.withdrawWindowstate ? (
          <div className="withdrawWindowPage">
            <div className="withdrawWindowCover" />
            <div className="withdrawWindow">
              <p>你的提现正在处理中，这个过程需要持续一段时间，请您稍后在您的接收地址查看</p>
              <div className="lineNotMar" />
              <pre
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.goBack();
                }}>
                确定
              </pre>
            </div>
          </div>
        ) : (
          false
        )}
        <div className="bom">
          <span />
          <span className="right">
            <span className="span2 iconfontMarket icon_8 icon-Group1" />
            <span
              className="span1"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push('/me/contact');
              }}>
              有疑问？联系我们
            </span>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});
export default connect(mapStateToProps)(withRouter(Withdraw));
