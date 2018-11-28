import React from 'react';
import { showToast } from '@/utils/common';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './newPassword.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface NewEmailProps {
  serverData: any;
  checkCode: string;
  phone: string;
}
interface NewEmailState {
  password: string;
  repassword: string;
}
type Props = NewEmailProps & DispatchProp & RouteComponentProps;

class NewEmail extends React.Component<Props, NewEmailState> {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      repassword: '',
    };
  }

  updatePassword = () => {
    if (!this.state.password || this.state.password.length <= 0) {
      showToast('密码不能为空', 2);
      return;
    }
    if (!this.state.repassword || this.state.repassword.length <= 0) {
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
    if (!(this.state.password == this.state.repassword)) {
      showToast('两次输入的密码不一致', 2);
      return;
    }
    const params = {
      newPassword: this.state.password,
      vcode: this.props.checkCode,
      phone: this.props.phone,
    };

    this.props.dispatch(
      //@ts-ignore
      fetchData.updatePassword(params, val => {
        // isFetching=false
        if (val.code == 200) {
          showToast('修改成功', 2);
          this.props.history.goBack();
        } else {
          showToast(val.msg, 3);
        }
      }),
    );
  };

  render() {
    return (
      <div className="">
        <Helmet>
          <title>修改密码</title>
        </Helmet>
        <div className="newPasswordPage">
          <div className="newPasswordInput">
            <p>新密码</p>
            <input
              placeholder="6-20位字母和数字组合"
              type="password"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={e => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />
          </div>
          <div className="newPasswordInput">
            <p>确认新密码</p>
            <input
              placeholder="请再次输入新密码"
              type="password"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={e => {
                this.setState({
                  repassword: e.target.value,
                });
              }}
            />
          </div>
          <pre onClick={this.updatePassword}>完成</pre>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.mePageState,
});
export default connect(mapStateToProps)(withRouter(NewEmail));
