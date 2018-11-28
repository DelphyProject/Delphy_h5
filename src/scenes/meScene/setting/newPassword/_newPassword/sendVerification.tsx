import React from 'react';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import InputVerification from './inputVerification';
import './verification.less';
import { baseurl } from '@/config/index';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface NewEmailProps {
  serverData: any;
}
interface NewEmailState {
  sendState: boolean;
  area: number;
  verify_key: string;
  verify_code: string;
  imgSrc: string;
  vertifyImgFlag: boolean;
  mobileNumber: any;
}
type Props = NewEmailProps & DispatchProp;

class NewEmail extends React.Component<Props, NewEmailState> {
  constructor(props) {
    super(props);
    this.state = {
      sendState: true,
      area: 86,
      verify_key: `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`,
      verify_code: '',
      imgSrc: '',
      vertifyImgFlag: false,
      mobileNumber: localStorage.getItem('username'),
    };
  }

  componentWillMount() {
    const from = sessionStorage.getItem('fromLogin');
    const phone = sessionStorage.getItem('phone');
    sessionStorage.removeItem('fromLogin');
    if (from == '1') {
      this.setState({
        mobileNumber: phone,
      });
    }
  }

  getVerifyCode = () => {
    // 获取图片验证码
    const code = `DPY${new Date().getTime()}${(Math.random() * 9).toFixed(0)}`;
    this.setState({ verify_key: code });
  };

  setVerifyCode = value => {
    this.setState({ verify_code: value });
  };

  sendEvents = () => {
    if (!this.state.verify_code || this.state.verify_code.length <= 0) {
      showToast('图片验证码不能为空', 2);
      return;
    }
    // if (isFetching) {return}
    // isFetching=true
    const params = { verify_key: this.state.verify_key, verify_code: this.state.verify_code };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchGetCheckCode1(this.state.mobileNumber.replace(/\s+/g, ''), params, val => {
        if (val.code == 200) {
          // isFetching = false
          this.setState({ sendState: false, vertifyImgFlag: false });
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  render() {
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
                +{this.state.area}{' '}
                {this.state.mobileNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              </h4>
              {/* <pre onClick={this.sendEvent}>发送验证码</pre> */}
              <pre
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.setState({ vertifyImgFlag: true });
                }}>
                发送验证码
              </pre>
            </div>
          </div>
        ) : (
          <InputVerification
            phone={this.state.mobileNumber}
            area={this.state.area}
            mobileNumber={this.state.mobileNumber}
          />
        )}
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
                  onClick={this.getVerifyCode}
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
              <pre onClick={this.sendEvents}>确定</pre>
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

export default connect(mapStateToProps)(NewEmail);
