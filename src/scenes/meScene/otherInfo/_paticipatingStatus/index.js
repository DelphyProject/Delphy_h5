import React from 'react';
import './paticipatingStatus.less';

export default class Means extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let rate;
    if (this.props.winCount) {
      rate =
        this.props.winCount == 0
          ? 0
          : ((this.props.winCount / (this.props.winCount + this.props.failCount)) * 100).toFixed(2);
    } else {
      rate = 0;
    }

    return (
      <div className={this.props.type == 1 ? 'timePackground timePackgroundBg' : 'timePackground'}>
        <ul>
          <li>
            <h4>参加场次</h4>
            <p>
              {this.props.playCount ? this.props.playCount : 0}
              <span> 场</span>
            </p>
          </li>
          <li>
            <h4>胜率</h4>
            <p>
              {rate}
              <span> %</span>
            </p>
          </li>
        </ul>
      </div>
    );
  }
}
