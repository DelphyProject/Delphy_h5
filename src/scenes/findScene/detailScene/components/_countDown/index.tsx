import React from 'react';

import '@/style/delphyConstStyle.less';
interface CountDownProps {
  date: any;
  getData: any;
}
interface CountDownState {
  timestamp: number;
  date: any;
  isEnd: boolean;
}
class CountDown extends React.Component<CountDownProps, CountDownState> {
  interval: NodeJS.Timer;
  constructor(props) {
    super(props);
    this.state = {
      timestamp: 0,
      date: null,
      isEnd: false,
    };
  }
  // static defaultProps = {
  //   date: new Date(),
  //   days: {
  //     plural: '天',
  //     singular: '天',
  //   },
  //   hours: ':',
  //   mins: ':',
  //   segs: ':',
  //   onEnd: () => {},
  //   timestamp: 0,
  //   isEnd: false,
  // };

  // state = {
  //   days: 0,
  //   hours: 0,
  //   min: 0,
  //   sec: 0,
  // };

  componentDidMount() {
    let lemp = this.state.timestamp;

    const interval = setInterval(() => {
      lemp -= 1;
      const d = this.getDateData(lemp);
      if (d) {
        // this.setState(date:date);
        this.setState({
          timestamp: lemp,
          date: d,
        });
      } else {
        this.props.getData();
        clearInterval(interval);
      }
    }, 1000);
  }

  componentWillMount() {
    const d = this.getDateData(this.props.date);
    if (d) {
      // this.setState(date);
      this.setState({
        timestamp: this.props.date,
        date: d,
      });
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  getDateData(endDate) {
    let diff = endDate + 60;

    if (diff < 60) {
      this.setState({
        isEnd: true,
      });
      return false;
    }

    const timeLeft: any = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // if (diff >= (365 * 86400)) {
    //     timeLeft.years = Math.floor(diff / (365 * 86400));
    //     diff -= timeLeft.years * 365 * 86400;
    // }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      if (timeLeft.days < 10 && timeLeft.days > 0) {
        timeLeft.days = `0${timeLeft.days}`;
      }
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
      if (timeLeft.hours < 10 && timeLeft.hours > 0) {
        timeLeft.hours = `0${timeLeft.hours}`;
      }
    }

    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
      if (timeLeft.min < 10 && timeLeft.min > 0) {
        timeLeft.min = `0${timeLeft.min}`;
      }
    }

    timeLeft.sec = diff;
    if (timeLeft.sec < 10 && timeLeft.sec > 0) {
      timeLeft.sec = `0${timeLeft.sec}`;
    }

    return timeLeft;
  }

  render() {
    const countDown: any = this.state.date;

    return (
      <span>
        {this.state.isEnd ? (
          <span />
        ) : (
          <span>
            {`${(countDown.days > 0 ? `${this.leadingZeros(countDown.days)}天` : '') +
              (countDown.hours > 0 ||
              (countDown.hours == 0 && countDown.days > 0) ||
              (countDown.hours > 0 && countDown.days == 0)
                ? `${this.leadingZeros(countDown.hours)}时`
                : '') +
              this.leadingZeros(countDown.min)}分`}
          </span>
        )}
      </span>
    );
  }

  stop = () => {
    this.props.getData();
    clearInterval(this.interval);
  };

  leadingZeros(num, length = null) {
    // tslint:disable-next-line:variable-name
    let length_: any = length;
    // tslint:disable-next-line:variable-name
    let num_ = num;
    if (length_ == null) {
      length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
      num_ = `0${num_}`;
    }
    return num_;
  }
}

export default CountDown;
