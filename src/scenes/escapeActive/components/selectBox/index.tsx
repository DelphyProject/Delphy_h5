import React from 'react';
import './selectBox.less';

class SelectBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="select-warp">
        <div className="select-item">
          选项A.能
          <span>支持</span>
        </div>
        <div className="select-item">
          选项B.不能
          <span>支持</span>
        </div>
      </div>
    );
  }
}
export default SelectBox;
