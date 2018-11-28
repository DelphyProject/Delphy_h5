import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './escape.less';
import { Button } from 'antd-mobile';
import Copy from 'copy-to-clipboard';
import { delphyUrl } from '@/config/index';
import LoginAlert from '@/components/loginAlert/loginAlert';
import Login from '@/components/loading/index';
import NotNetwork from '@/components/notNetwork/index';
import { shareMethod, redirect, reLoad } from '@/utils/share';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { showToast } from '@/utils/common';
import { countTime, initNum } from '../commonjs/time';
import MainBanner from '../components/mainBanner/index';
import { HeadBanner } from '../components/headBanner/index';
import ModalMask from '../components/modalMask/index';

interface MainPageProps {
  id: string;
  escapeData: any;
}

interface State {
  stateType: number;
  isErrorShow: boolean;
  isLoadingShow: boolean;
  isToastShow: boolean;
  isMaskShow: boolean;
  isShowBegin: boolean;
  isLoginShow: boolean;
  hours: string;
  minutes: string;
  seconds: string;
  timeTitleInfo: Array<string>;
  height: number;
  isActive: boolean;
  currentPrizePool: number;
  numInvestor: number;
}

type Props = MainPageProps & DispatchProp & RouteComponentProps;

class MainPage extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isErrorShow: false,
      isLoadingShow: false,
      isToastShow: false,
      isMaskShow: false,
      isShowBegin: false,
      isLoginShow: false,
      hours: '--',
      minutes: '--',
      seconds: '--',
      timeTitleInfo: ['距离开始仅剩', '剩余截止时间'],
      stateType: 0,
      height: 0,
      isActive: false,
      currentPrizePool: 0,
      numInvestor: 0,
    };
    redirect();
  }

  componentWillUnmount() {
    window.socket.removeListener(this.props.id);
    reLoad();
  }

  componentWillMount() {
    window.socket.on(this.props.id, data => {
      this.setState({ currentPrizePool: data.reward, numInvestor: data.numInvestor });
    });
    this.setState({
      height: window.innerHeight,
    });
    this.setState({ isLoadingShow: true });

    if (this.props.id) {
      const obj = {
        shareUrl: window.location.href,
        type: 4,
        id: this.props.id,
      };

      shareMethod(obj);
      this.props.dispatch(
        // @ts-ignore
        fetchData.getCurrentActiveDetail(this.props.id, res => {
          if (res.code != 200) {
            this.setState({ isErrorShow: true, isLoadingShow: false });
            showToast(res.msg, 3);
          }
        }),
      );
      this.props.dispatch(
        // @ts-ignore
        fetchData.getEscapeMarketListData(this.props.id, res => {
          if (res.code != 200) {
            this.setState({ isErrorShow: true, isLoadingShow: false });
            showToast(res.msg, 3);
          }
        }),
      );
    }
  }

  componentWillReceiveProps(props) {
    if (!props.escapeData.isLoadingA && !props.escapeData.isLoadingB) {
      let flag = true;
      if (props.escapeData.currentData.userStatus == -1) {
        // userStatus：0参与中；userStatus：-1未报名
        flag = false;
      }
      this.setState({ isLoadingShow: false, isActive: flag });
      if (
        props.escapeData.currentData.currentTime &&
        props.escapeData.currentData.startTime - props.escapeData.currentData.currentTime > 0
      ) {
        // 报名未开始 即将报名
        this.setDiffTime(
          props.escapeData.currentData.currentTime,
          props.escapeData.currentData.startTime,
        );
      } else if (
        props.escapeData.currentData.currentTime &&
        props.escapeData.currentData.startTime - props.escapeData.currentData.currentTime <= 0 &&
        props.escapeData.currentData.endTime - props.escapeData.currentData.currentTime > 0
      ) {
        // 报名已开始、报名时间结束前
        this.setState({ stateType: 1 }, () => {
          this.setDiffTime(
            props.escapeData.currentData.currentTime,
            props.escapeData.currentData.endTime,
          );
        });
      }
    }
  }

  /**
   * @description 倒计时时调用的方法
   * @augments startTime 当前时间 单位s
   * @augments endTime 截止时间 单位s
   */
  setDiffTime = (startTime, endTime) => {
    const setTimeFn = setInterval(() => {
      // 每1s给startTime增1s
      startTime += 1;
      // 到结束时间
      if (startTime > endTime) {
        // 清除定时器
        clearInterval(setTimeFn);
        if (this.state.stateType == 0) {
          this.willStart();
        } else if (this.state.stateType == 1) {
          // this.didStart();
          this.setState({
            stateType: 0,
          });
        }
      }
      const { hours, minutes, seconds } = countTime(startTime, endTime);
      this.setState({
        hours,
        minutes,
        seconds,
      });
    }, 1000);
  };

  // 活动即将开始时调用
  willStart = () => {
    // 显示 马上开始吃鸡 按钮
    this.setState(
      {
        isShowBegin: true,
        stateType: 1,
      },
      () => {
        this.setDiffTime(
          this.props.escapeData.currentData.startTime,
          this.props.escapeData.currentData.endTime,
        );
      },
    );
  };

  // 活动已经开始但是还未结束报名
  didStart = () => {
    //
  };

  // 点击跳转参加活动页面
  addActive = () => {
    if (!this.state.isActive && window.localStorage.getItem('token')) {
      this.props.history.push(`/escape/payPage/${this.props.escapeData.currentData.activityId}`);
    } else if (window.localStorage.getItem('token') && this.state.isActive) {
      this.props.history.push(
        `/escape/activeMarketList/${this.props.escapeData.currentData.activityId}`,
      );
    } else {
      this.setState({ isLoginShow: true });
    }
    // this.props.history.push('/payPage');
  };

  // 显示规则遮罩
  showActiveRules = () => {
    this.setState({
      isMaskShow: true,
    });
  };

  // 隱藏规则遮罩
  maskClose = () => {
    this.setState({
      isMaskShow: false,
    });
  };

  // 点击分享触发的事件
  getUrl = () => {
    Copy(`邀请您参加<天算吃鸡专场>,链接：${delphyUrl}escape/activity/${this.props.id}`);
    this.setState({
      isToastShow: true,
    });
  };

  // 点击遮罩中的确定按钮触发
  ClickWindowCancel = () => {
    this.setState({
      isToastShow: false,
    });
  };

  // 隐藏去登录的alert mask
  hideAlert = () => {
    this.setState({ isLoginShow: false });
  };

  toHistory = () => {
    this.props.history.push('/escape/historyResult');
  };

  render() {
    const renderBtn = type => {
      if (type == 0) {
        return (
          <Button className="btns-right" disabled={true}>
            马上挑战吃鸡
          </Button>
        );
      }
      if (type == 1) {
        return (
          <Button className="btns-right red-btn" onClick={this.addActive}>
            马上挑战吃鸡
          </Button>
        );
      }
      return null;
    };

    return (
      <div className="body-warp" style={{ minHeight: this.state.height }}>
        <Helmet>
          <title>吃鸡专场</title>
        </Helmet>
        {/* loading加载中提示 */}
        {!!this.state.isErrorShow && (
          <div className="loading-mask">
            <NotNetwork />
          </div>
        )}
        {!!this.state.isLoadingShow && (
          <div className="loading-mask">
            <Login />
          </div>
        )}
        {/* 剪贴板alert提示 */}
        {this.state.isToastShow ? (
          <div className="clickWindow" id="inviteMethodClickWindow">
            <div className="clickWindowCover" onClick={this.ClickWindowCancel} />
            <div className="clickWindowIn">
              <p>邀请链接已复制到粘贴板，请直接发送给您的好友</p>
              <p className="lineNotMar" />
              <p onClick={this.ClickWindowCancel}>确定</p>
            </div>
          </div>
        ) : null}
        {/* 登录提示 */}
        {this.state.isLoginShow ? (
          <LoginAlert info="你尚未登录，请登录" text="去登录" hideAlert={this.hideAlert} />
        ) : null}

        {/* 活动规则遮罩 */}
        <div className="modal-mask">
          {this.state.isMaskShow ? <ModalMask maskClose={this.maskClose} /> : null}
        </div>
        {/* 页面头部 */}
        <HeadBanner
          isShare={true}
          getUrl={this.getUrl}
          url={this.props.escapeData.currentData.image}
        />
        {/* 倒计时显示 */}
        <div className="time-banner">
          <div className="time-left">
            <div className="time-title">
              本期奖池(DPY)
              <span className="icon-info" onClick={this.showActiveRules} />
            </div>
            <div className="dpy-count">
              {this.state.currentPrizePool
                ? initNum(this.state.currentPrizePool)
                : initNum(this.props.escapeData.currentData.reward)}
              {/* {initNum(this.state.currentPrizePool)} */}
              {this.state.stateType == 1 ? (
                <span className="user-add-info">
                  {this.state.numInvestor
                    ? initNum(this.state.numInvestor)
                    : initNum(this.props.escapeData.currentData.numInvestor)}
                  {/* {this.state.numInvestor ?initNum(this.state.numInvestor) : 0} */}
                  人已报名
                </span>
              ) : null}
            </div>
          </div>
          <div className="time-right">
            <div className="font-title">
              {this.state.stateType == 0
                ? this.state.timeTitleInfo[0]
                : this.state.timeTitleInfo[1]}
            </div>
            {/* 倒计时时间显示 */}
            <div className="time-box">
              <span>{this.state.hours}</span>:<span>{this.state.minutes}</span>:
              <span>{this.state.seconds}</span>
            </div>
          </div>
        </div>
        {/* 主banner图 */}
        <div className="next-guess">— 下一场预测 —</div>
        <MainBanner mainData={this.props.escapeData.marketListData} />
        {/* 底部按钮 */}
        <div className="btns-warp">
          <Button className="btns-left" onClick={this.toHistory}>
            历史战绩
          </Button>
          {renderBtn(this.state.stateType)}
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  // escapeData: store.escapeMain,
  escapeData: store.escapeMarketList,
});

export default connect(mapStateToProps)(MainPage);
