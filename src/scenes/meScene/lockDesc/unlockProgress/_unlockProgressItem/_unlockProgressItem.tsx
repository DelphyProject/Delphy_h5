import React from 'react';
import './unlockProgressItem.less';
interface UnlockProgressItemProps {
  data: any;
  isFirst: boolean;
}
class UnlockProgressItem extends React.Component<UnlockProgressItemProps> {
  render() {
    const data = this.props.data;
    const remainTime = data.remainTime;
    const dpy = data.dpy != undefined && data.dpy != '0' ? data.dpy.toFixed(2) : '--';
    const isFirst = this.props.isFirst;
    let tip;
    if (isFirst) {
      tip = '最近';
    } else {
      tip = '';
    }

    return (
      <div className="unlockProgressItem">
        <div className="content">
          <div className="left">
            <span className="time">
              {remainTime}
              后解锁
            </span>
            <span className="tip">{tip}</span>
          </div>
          <span className="dpy">{dpy}</span>
        </div>
        <div className="divideLine" />
      </div>
    );
  }
}

export default UnlockProgressItem;
