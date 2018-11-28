import React from 'react';
import './notNetwork.less';

export default class NetworkFail extends React.Component {
  handleClick = () => {
    location.reload();
  };

  render() {
    return (
      <div className="notNetwork">
        <img src={require('../../img/public_illustration_nosignal.png')} alt="" />
        <p>网络错误</p>
        <pre onClick={this.handleClick}>重新加载</pre>
      </div>
    );
  }
}
