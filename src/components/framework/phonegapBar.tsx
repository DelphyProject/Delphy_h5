import React from 'react';
import './phonegapBar.less';

interface PhonegapBarProps {
  onBack: Function;
  showBack: boolean;
  title: string;
}

class PhonegapBar extends React.Component<PhonegapBarProps> {
  back = () => {
    this.props.onBack();
  };

  reload = () => {
    window.location.reload();
  };

  render() {
    return (
      <div className="navBar">
        <div className="phonegapBar">
          {!this.props.showBack ? (
            <div className="mBack" />
          ) : (
            <img src={require('@/img/back.svg')} className="mBackInvisable" onClick={this.back} />
          )}
          <p className="mTitle">{this.props.title}</p>
          <img src={require('@/img/reload.svg')} className="mReload" onClick={this.reload} />
        </div>
        <div className="dividerline" />
      </div>
    );
  }
}

export default PhonegapBar;
