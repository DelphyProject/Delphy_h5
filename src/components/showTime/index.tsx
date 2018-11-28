import React from 'react';
import './showTime.less';
import { getNowTimestamp } from '@/utils/time';

interface ShowTimeProps {
  time: number;
}

class ShowTime extends React.Component<ShowTimeProps> {
  getTimeInterval(time) {
    const lemp = getNowTimestamp() - time;
    if (lemp < 60) {
      return '刚刚';
    }
    if (lemp < 60 * 60) {
      return `${(lemp / 60).toFixed(0)}分钟前`;
    }
    if (lemp < 60 * 60 * 24) {
      return `${(lemp / 3600).toFixed(0)}小时${((lemp % 3600) / 60).toFixed(0)}分钟前`;
    }
    return `${(lemp / (60 * 60 * 24)).toFixed(0)}天前`;
  }

  render() {
    return (
      <div className="showTime">{this.props.time ? this.getTimeInterval(this.props.time) : ''}</div>
    );
  }
}

export default ShowTime;
