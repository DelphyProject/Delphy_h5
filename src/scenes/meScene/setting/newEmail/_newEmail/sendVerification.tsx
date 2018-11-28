import { showToast } from '@/utils/common';
import React from 'react';
import './newEmail.less';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import InputVerification from './inputVerification';
import './verification.less';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface NewEmailProps {
  serverData: any;
  email: string;
}
interface NewEmailState {
  sendState: boolean;
  area: number;
}
type Props = NewEmailProps & DispatchProp;

let isFetching = false;
class NewEmail extends React.Component<Props, NewEmailState> {
  constructor(props) {
    super(props);
    this.state = {
      sendState: true,
      area: 86,
    };
  }

  getCheckCode = () => {
    if (isFetching) {
      return;
    }
    isFetching = true;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchGetCheckCode(localStorage.getItem('username'), val => {
        isFetching = false;
        if (val.code == 200) {
          this.setState({
            sendState: false,
          });

          // this._timer()
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  render() {
    const username = localStorage.getItem('username');
    return (
      <div className="newInformation">
        {this.state.sendState == true ? (
          <div>
            <Helmet>
              <title>发送验证码</title>
            </Helmet>
            <div className="sendVerification">
              <p>为保证您的账号安全，请进行身份验证，验证成功后进行下一步操作。</p>
              <h4>
                +{this.state.area} {username}
              </h4>
              <pre onClick={this.getCheckCode}>发送验证码</pre>
            </div>
          </div>
        ) : (
          <InputVerification
            email={this.props.email}
            area={this.state.area}
            mobileNumber={username}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.mePageState,
});

export default connect(mapStateToProps)(NewEmail);
