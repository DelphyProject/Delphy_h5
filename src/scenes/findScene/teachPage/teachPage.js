import React from 'react';
import { withRouter } from 'react-router-dom';
import './teachPage.less';

class teachPage extends React.Component {
  render() {
    return (
      <div className="teachPage">
        <img className="img1" src={require('../../../img/find/teachPage.jpg')} />
        <img
          className="img2"
          src={require('../../../img/find/regest.png')}
          onClick={() => {
            this.props.history.push('/login');
            sessionStorage.setItem('isLoginStatus', 2);
          }}
        />
      </div>
    );
  }
}
export default withRouter(teachPage);
