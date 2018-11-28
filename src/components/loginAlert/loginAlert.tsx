import React, { MouseEvent, Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './loginAlert.less';

interface LoginAlertProps {
  text: string;
  isSharBag?: number;
  hideAlert?: any;
  info: string;
}

type Props = LoginAlertProps & RouteComponentProps;

class LoginAlert extends Component<Props> {
  loginUrl = () => {
    if (this.props.isSharBag == 1) {
      const data = {
        pathname: '/login',
        state: 'isSharBag',
      };
      this.props.history.push(data);
    } else {
      this.props.history.push('/login');
    }
  };

  handleElClick = (e: MouseEvent<HTMLUListElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.hideAlert();
    this.loginUrl();
  };

  render() {
    return (
      <div className="loginAlert" onClick={this.props.hideAlert}>
        <div className="sign0utCover" />
        <div className="sign0utCoverIn">
          <p>{this.props.info}</p>
          <div className="lineNotMar" />
          {/* TODO: 为啥是ul标签？使用div标签更合理？ */}
          <ul onClick={this.handleElClick}>{this.props.text}</ul>
        </div>
      </div>
    );
  }
}

export default withRouter<Props>(LoginAlert);
