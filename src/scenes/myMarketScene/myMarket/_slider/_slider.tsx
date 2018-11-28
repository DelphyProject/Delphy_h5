import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import Background from '../../../../img/myMarket/bannerBg.png';
//@ts-ignore
import Background from '../../../../img/myMarket/bg-img.png';
import './_slider.less';

const myMarketHeadBg = {
  // makesure here is String确保这里是一个字符串，以下是es6写法
  backgroundImage: `url(${Background})`,
};
interface SliderProps {
  userProfile: any;
  changeToEscape: any;
}
interface SliderState {
  data: any;
  imgHeight: number;
  slideIndex: number;
  isCommon: boolean;
  isEscape: boolean;
}
type Props = SliderProps & RouteComponentProps;
class Slider extends React.Component<Props, SliderState> {
  constructor(props) {
    super(props);
    this.state = {
      data: ['1', '2', '3'],
      imgHeight: 176,
      slideIndex: 0,
      isCommon: true,
      isEscape: false,
    };
  }

  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
  }

  // 切换类型（1、普通类型 2、吃鸡活动类型）
  changeType = type => {
    if (type == 1) {
      this.setState({ isCommon: true, isEscape: false });
    } else {
      this.setState({ isCommon: false, isEscape: true });
    }
    this.props.changeToEscape(type);
  };

  formateTime = time => {
    if (time) {
      const initTime = new Date(time * 1000);
      const year = initTime.getFullYear();
      const month =
        initTime.getMonth() + 1 < 10 ? `0${initTime.getMonth() + 1}` : initTime.getMonth() + 1;
      const day = initTime.getDate() < 10 ? `0${initTime.getDate()}` : initTime.getDate();
      const h = initTime.getHours() < 10 ? `0${initTime.getHours()}` : initTime.getHours();
      const m = initTime.getMinutes() < 10 ? `0${initTime.getMinutes()}` : initTime.getMinutes();
      const s = initTime.getSeconds() < 10 ? `0${initTime.getSeconds()}` : initTime.getSeconds();
      return `${year}.${month}.${day} ${h}:${m}:${s}`;
    }
    return '2000.01.01 00:00:00';
  };

  render() {
    const userProfile = this.props.userProfile;
    let winIncome: any = 0;
    let wincount = 0;
    let winRate: any = 0;
    let lastInCome = 0;
    let time: any = 0;
    let attendCount = 0;
    if (userProfile != null) {
      winIncome = userProfile.income == undefined ? '0.00' : Number(userProfile.income).toFixed(2);
      if (userProfile.statisticsVO && userProfile.statisticsVO.length) {
        wincount =
          userProfile.statisticsVO[0].wincount == undefined
            ? 0
            : userProfile.statisticsVO[0].wincount;
        winRate =
          userProfile.statisticsVO[0].winRate == undefined
            ? 0
            : userProfile.statisticsVO[0].winRate;
        attendCount =
          userProfile.statisticsVO[0].attendCount == undefined
            ? 0
            : userProfile.statisticsVO[0].attendCount;
      } else {
        wincount = 0;
        winRate = '0%';
        attendCount = 0;
      }
      if (userProfile.lastTransactionVO) {
        lastInCome = userProfile.lastTransactionVO.cost.toFixed(2);
        time = this.formateTime(userProfile.lastTransactionVO.createTime);
      } else {
        lastInCome = 0;
        time = '2000.01.01 00:00:00';
      }
    } else {
      winIncome = 0;
    }

    return (
      <div className="sliderOwn">
        <div className="myMarketHeadTwo" style={myMarketHeadBg}>
          <p>获胜收益(DPY)</p>
          <p>{winIncome}</p>
          {lastInCome ? (
            // tslint:disable-next-line:jsx-no-lambda
            <p onClick={() => this.props.history.push('/me/transactionRecord')}>
              <span>
                +{lastInCome}
                DPY{' '}
              </span>
              <span className="data-num">{time} </span>
              <img src={require('./../../../../img/arrow.png')} />
            </p>
          ) : (
            <p>
              <span style={{ color: '#fff' }}>暂无</span>
            </p>
          )}

          <div className="tab-tap">
            <div
              className={this.state.isCommon ? 'click-tap' : 'false'}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.changeType(1);
              }}>
              <img
                // eslint-disable-next-line
                src={require(this.state.isCommon
                  ? './../../../../img/tap1-click.png'
                  : './../../../../img/tap.png')}
              />
              预测话题
            </div>
            <div
              className={this.state.isEscape ? 'click-tap' : 'false'}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.changeType(2);
              }}>
              <img
                // eslint-disable-next-line
                src={require(this.state.isEscape
                  ? './../../../../img/escape-icon.png'
                  : './../../../../img/tap2-click.png')}
              />
              吃鸡活动
            </div>
          </div>
          <ul className="myMarketHeadList">
            <li>
              参与场次
              <span>{attendCount}</span>
            </li>
            <li>
              获胜场次
              <span>{wincount}</span>
            </li>
            <li>
              预测胜率
              <span>{winRate}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Slider);
