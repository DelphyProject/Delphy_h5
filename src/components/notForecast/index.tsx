import React from 'react';
import './notForecast.less';

interface LoadingProps {
  title: string;
  titleTwo: string;
}

class Loading extends React.Component<LoadingProps> {
  render() {
    return (
      <div className="notForecast">
        <img src={require('@/img/public-illustration-content.png')} alt="" />
        <p>{this.props.title}</p>
        <p>{this.props.titleTwo}</p>
      </div>
    );
  }
}

export default Loading;
