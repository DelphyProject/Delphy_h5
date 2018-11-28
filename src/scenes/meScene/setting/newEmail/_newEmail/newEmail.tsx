import React from 'react';
import { Helmet } from 'react-helmet';

import './newEmail.less';

interface NewEmailProps {
  email: string;
}
type Props = NewEmailProps;
class NewEmail extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="">
        <Helmet>
          <title>新邮箱</title>
        </Helmet>
        <div className="newEmailPage">
          <p className="oldEmail">
            当前邮箱地址:
            {this.props.email}
          </p>
          <div className="newEmailInput">
            <p>新邮箱地址</p>
            <input type="text" placeholder="请输入新邮箱地址" />
          </div>
          <pre>完成</pre>
        </div>
      </div>
    );
  }
}

export default NewEmail;
