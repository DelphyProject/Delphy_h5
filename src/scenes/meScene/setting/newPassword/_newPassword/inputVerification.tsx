import { showToast } from '@/utils/common';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect, DispatchProp } from 'react-redux';
import NewEmail from './newPassword';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface InputVerificationProps {
  serverData: any;
  phone: string;
  area: string;
  mobileNumber: string;
}
interface InputVerificationState {
  InputState: boolean;
  Countdown: number;
  sendBtnState: boolean;
  checkCode: string;
}
type Props = InputVerificationProps & DispatchProp;

// let isFetching=false
class InputVerification extends React.Component<Props, InputVerificationState> {
  constructor(props) {
    super(props);
    this.state = {
      InputState: true,
      Countdown: 60,
      sendBtnState: false,
      checkCode: '',
    };
  }

  componentDidMount() {
    this.sendTimeBtn();
  }

  sendTimeBtn = () => {
    const time = setInterval(() => {
      this.setState({
        Countdown: this.state.Countdown - 1,
      });
      if (this.state.Countdown <= 0) {
        this.setState({
          sendBtnState: true,
          Countdown: 60,
        });
        clearTimeout(time);
      }
    }, 1000);
  };

  sendTimeEvent = () => {
    this.setState({
      sendBtnState: false,
    });
    this.getCheckCode();
  };

  getCheckCode = () => {
    const username = localStorage.getItem('username');
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchGetCheckCode(username, val => {
        // isFetching=false

        if (val.code == 200) {
          this.setState({
            sendBtnState: false,
          });
          this.sendTimeBtn();
        } else {
          this.setState({
            sendBtnState: false,
          });
          showToast(val.msg, 3);
        }
      }),
    );
  };

  thisSave = () => {
    if (!this.state.checkCode || this.state.checkCode.length <= 0) {
      showToast('验证码不能为空', 2);
      return;
    }
    this.setState({
      InputState: false,
    });
  };

  render() {
    return (
      <div className="">
        {this.state.InputState == true ? (
          <div className="inputVerification">
            <Helmet>
              <title>填写验证码</title>
            </Helmet>
            <p>
              短信验证码已发送至+
              {this.props.area} {this.props.mobileNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              ，请注意查收
            </p>
            <input
              type="text"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={e => {
                this.setState({
                  checkCode: e.target.value,
                });
              }}
            />
            {this.state.sendBtnState == false ? (
              <h5>
                {this.state.Countdown}
                秒后可重新发送
              </h5>
            ) : (
              <h5 onClick={this.sendTimeEvent}>重新发送</h5>
            )}

            <pre onClick={this.thisSave}>完成</pre>
          </div>
        ) : (
          <NewEmail phone={this.props.phone} checkCode={this.state.checkCode} />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.loginUserState,
});

export default connect(mapStateToProps)(InputVerification);
