import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './teachPage.less';

type Props = RouteComponentProps;

class TeachPage extends React.Component<Props> {
  handleImgClick = () => {
    this.props.history.push('/login');
    sessionStorage.setItem('isLoginStatus', '2');
  };

  render() {
    return (
      <div className="teachPage">
        <img className="img1" src={require('../../../img/find/teachPage.jpg')} />
        <img
          className="img2"
          src={require('../../../img/find/regest.png')}
          onClick={this.handleImgClick}
        />
      </div>
    );
  }
}
export default withRouter(TeachPage);
