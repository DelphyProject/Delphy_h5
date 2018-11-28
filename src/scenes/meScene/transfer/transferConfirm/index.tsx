import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import './transferConfirm.less';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
interface TransferConfirmState {
  inputType: string;
  vcode: string;
  password: string;
  timeState: boolean;
  timeCount: number;
  avatar: string;
}
type Props = DispatchProp & RouteComponentProps;
class TransferConfirm extends React.Component<Props, TransferConfirmState> {
  constructor(props) {
    super(props);
    this.state = {
      inputType: 'text',
      vcode: '',
      password: '',
      timeState: true,
      timeCount: 60,
      avatar:
        this.props.location.state.avatar != null
          ? `${this.props.location.state.avatar}?imageView2/1/w/200/h/200`
          : require('../../../../img/my_photo_none.png'),
    };
  }

  getVcode = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.applyMyVcode(null, ret => {
        if (ret.code == 200) {
          this.setState({
            timeState: false,
          });
          this._timer();
        } else {
          showToast('获取验证码失败', 2);
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

  render() {
    return (
      <div className="transferConfirm">
        <div className="userAvatar">
          <div>
            <img src={this.state.avatar} alt="" />
          </div>
          <div className="rows">
            <div className="rowItem">
              <span>收款人</span>
              <span>{this.props.location.state.nickname}</span>
            </div>
            <div className="rowItem">
              <span>转账金额</span>
              <span>{this.props.location.state.amount} DPY</span>
            </div>
          </div>
          <div className="vcodeArea">
            <p className="registerVOne">
              <span>验证码</span>
              <input
                type="text"
                className="inputLabel"
                placeholder="请输入验证码"
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  this.setState({
                    vcode: e.target.value,
                  });
                }}
                value={this.state.vcode}
              />
            </p>
            {this.state.timeState == true ? (
              <input
                type="button"
                className="registerVTwo"
                value="获取验证码"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.getVcode();
                }}
              />
            ) : (
              <div className="registerVTwo">
                <span>{this.state.timeCount} </span>S
              </div>
            )}
          </div>
          <div className="pwdArea">
            <div className="registerP">
              <span>密码</span>
              <input
                type={this.state.inputType}
                className="inputLabel"
                placeholder="请输入您的密码"
                // tslint:disable-next-line:jsx-no-lambda
                onFocus={() => {
                  this.setState({
                    inputType: 'password',
                  });
                }}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={e => {
                  this.setState({
                    password: e.target.value,
                  });
                }}
                value={this.state.password}
              />
            </div>
          </div>
          <p className="transferBullet">·确认转帐前，请务必与收款人核对以上信息。</p>
          <p className="transferBullet">·该功能为即时转账，一旦确认，将无法退款。</p>
          <input
            type="button"
            className="confirmBtn font_weight"
            value="确认转账"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              // Checks input
              if (this.state.vcode.length == 0) {
                showToast('请输入验证码', 2);
                return;
              }
              if (this.state.password.length == 0) {
                showToast('请输入密码', 2);
              }

              // Sends the request
              const params = {
                userId: this.props.location.state.userId,
                amount: this.props.location.state.amount,
                password: Base64.stringify(MD5(`${this.state.password}delphy`)),
                vcode: this.state.vcode,
              };
              this.props.dispatch(
                //@ts-ignore
                fetchData.transfer(params, ret => {
                  if (ret.code == 200) {
                    // Success
                    showToast('转账成功', 2);
                    setTimeout(() => {
                      this.props.history.go(-2);
                    }, 2000);
                  } else {
                    // Failure
                    showToast(ret.msg, 2);
                  }
                }),
              );
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.messageState,
});

export default connect(mapStateToProps)(TransferConfirm);
