import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import './otherHeader.less';

interface OtherHeadProps {
  serverData: any;
  profileid: string;
}

interface OtherHeadState {
  isShow: boolean;
}

type Props = OtherHeadProps & DispatchProp & RouteComponentProps;
class OtherProfile extends React.Component<Props, OtherHeadState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
  }

  componentDidMount() {
    const userId = window.localStorage.getItem('userId');
    if (userId == this.props.profileid) {
      this.setState({ isShow: true });
    }
  }

  render() {
    const { otherInfo } = this.props.serverData;
    let marketNum = 0;
    let marketRate = '0%';
    let activeNum = 0;
    let activeRate = '0%';
    if (otherInfo.statisticsVO && otherInfo.statisticsVO.length) {
      marketNum = otherInfo.statisticsVO[0].attendCount;
      marketRate = otherInfo.statisticsVO[0].winRate;
      activeNum = otherInfo.statisticsVO[1].attendCount;
      activeRate = otherInfo.statisticsVO[1].winRate;
    }
    // 头像处胜率渲染函数
    const winRateRender = () => {
      if (otherInfo.statisticsVO && otherInfo.statisticsVO.length) {
        switch (otherInfo.statisticsVO[0].grade) {
          case 'newbie':
            return <span className="level1">新手</span>;
            break;
          case 'white':
            return (
              <span className="level1">
                胜率
                {otherInfo.statisticsVO[0].winRate}
              </span>
            );
            break;
          case 'yellow':
            return (
              <span className="level2">
                胜率
                {otherInfo.statisticsVO[0].winRate}
              </span>
            );
            break;
          case 'red':
            return (
              <span className="level3">
                胜率
                {otherInfo.statisticsVO[0].winRate}
              </span>
            );
            break;
          default:
            return <span className="level1">胜率0%</span>;
            break;
        }
      } else {
        return <span className="level1">胜率0%</span>;
      }
    };
    return (
      <div>
        <div className="othersPage">
          <div className="otherHead">
            <div className="otherHeadInfo">
              <div>
                <img src={otherInfo.avatar} alt="图片" />
                {winRateRender()}
              </div>
              <div>
                <h4>{otherInfo.nickname}</h4>
                <p>{otherInfo.description}</p>
              </div>
            </div>
          </div>
          <div className="after-box">
            <div className="content-box">
              <div className="radius-box">
                <div className="content-item">
                  <img src={require('./../../../../img/info-icon.png')} />
                  <div className="font-title">预测话题</div>
                  <div className="join-active">
                    <p>参加场次</p>
                    <span>{marketNum}</span>
                  </div>
                  <div className="win-rate">
                    <p>预测胜率</p>
                    <span>{marketRate}</span>
                  </div>
                </div>
                {this.state.isShow ? (
                  <div className="content-item">
                    <img src={require('./../../../../img/chicken-icon.png')} />
                    <div className="font-title">吃鸡活动</div>
                    <div className="join-active">
                      <p>参加场次</p>
                      <span>{activeNum}</span>
                    </div>
                    <div className="win-rate">
                      <p>预测胜率</p>
                      <span>{activeRate}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(OtherProfile);
