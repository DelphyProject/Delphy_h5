import React from 'react';
import './newEmail.less';
import { showToast } from '@/utils/common';
import { Helmet } from 'react-helmet';
import { connect, DispatchProp } from 'react-redux';
import NewEmail from './newEmail';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface InputVerificationProps {
  serverData: any;
  area: string;
  mobileNumber: string | number;
  email: string;
}
interface InputVerificationState {
  InputState: boolean;
  Countdown: number;
  sendBtnState: boolean;
}
type Props = InputVerificationProps & DispatchProp;

let isFetching = false;
class InputVerification extends React.Component<Props, InputVerificationState> {
  constructor(props) {
    super(props);
    this.state = {
      InputState: true,
      Countdown: 5,
      sendBtnState: false,
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
          Countdown: 5,
        });
        clearTimeout(time);
      }
    }, 1000);
  };

  sendTimeEvent = () => {
    if (isFetching) return;
    isFetching = true;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchGetCheckCode(localStorage.getItem('username'), val => {
        false;

        if (val.code == 200) {
          this.setState({
            sendBtnState: false,
          });
          this.sendTimeBtn();
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  sendEvent = () => {
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
              {this.props.area} {this.props.mobileNumber}
              ，请注意查收
            </p>
            <input type="text" />
            {this.state.sendBtnState == false ? (
              <pre className="buttonGray">
                {this.state.Countdown}
                秒后可重新发送
              </pre>
            ) : (
              <pre onClick={this.sendTimeEvent}>重新发送</pre>
            )}

            <pre onClick={this.sendEvent}>完成</pre>
          </div>
        ) : (
          <NewEmail email={this.props.email} />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.mePageState,
});
export default connect(mapStateToProps)(InputVerification);
