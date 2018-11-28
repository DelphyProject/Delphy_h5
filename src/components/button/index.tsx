import React, { Component } from 'react';

import './style.less';

interface ButtonProps {
  text: string;
  color: string;
}

export default class Bt extends Component<ButtonProps> {
  render() {
    const { text, color } = this.props;
    let className;
    if (color == undefined || color == '') className = 'voilet';
    else className = color;

    return (
      // <Link to={url} >
      <div className="bt">
        <div className={className}>{text}</div>
      </div>
      //  </Link>
    );
  }
}
