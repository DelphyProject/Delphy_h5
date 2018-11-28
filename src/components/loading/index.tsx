import React, { Component } from 'react';
import './loading.less';

class Loading extends Component {
  render() {
    return (
      <div className="loadingPage">
        <div className="loadingInner">
          <img src={require('@/img/d_loading1.svg')} alt="" />
          <p>加载中 请稍候...</p>
        </div>
      </div>
    );
  }
}

export default Loading;
