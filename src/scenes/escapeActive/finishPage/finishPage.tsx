import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import Copy from 'copy-to-clipboard';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import webViewApi from '../../../webViewerApi';
import { delphyUrl } from '../../../config';
import { shareMethod, redirect, reLoad } from '../../../utils/share';
import './finishPage.less';

interface RouteParams {
  activityId?: string;
  Nickname?: string;
}

interface FinishPageProps {
  escapeData: any;
}
interface FinishPageState {
  height: number;
}

type Props = FinishPageProps & DispatchProp & RouteComponentProps<RouteParams>;

class FinishPage extends React.Component<Props, FinishPageState> {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
    redirect();
  }

  componentWillUnmount() {
    reLoad();
  }

  componentWillMount() {
    this.setState({
      height: window.innerHeight,
    });
    const obj = {
      shareUrl: window.location.href,
      type: 5,
      userId: localStorage.getItem('userId'),
      id: this.props.match.params.activityId,
    };
    shareMethod(obj);
    if (this.props.match.params.Nickname) {
      const params = {
        activityId: this.props.match.params.activityId,
        userId: this.props.match.params.Nickname,
      };
      // @ts-ignore
      this.props.dispatch(fetchData.getFinishActiveShareDetail(params));
      // @ts-ignore
      this.props.dispatch(fetchData.getWinnerList(this.props.match.params.activityId, 1));
    } else {
      // @ts-ignore
      this.props.dispatch(fetchData.getFinishActiveDetail(this.props.match.params.activityId));
      // @ts-ignore
      this.props.dispatch(fetchData.getWinnerList(this.props.match.params.activityId, 1));
    }
  }

  joinGame = () => {
    this.props.history.push('/find');
  };

  share = (state1, state2, reword, survivorChance, image) => {
    let title1 = '';
    let title2 = '';
    const userId = localStorage.getItem('userId');
    title2 = `天算吃鸡专场，${reword}DPY等你来拿`;
    if (state1 == 0 && state2 == 2) {
      title1 = '大吉大利，我吃鸡了';
    } else {
      title1 = `我击败了${survivorChance * 1}%的参与者，差点就吃鸡了！`;
    }
    const platform = localStorage.getItem('platform');
    if (window.delphy) {
      window.delphy.share(
        title1,
        title2,
        `${delphyUrl}escape/finishPage/share/${this.props.match.params.activityId}/${userId}`,
        image,
      );
      // window.delphy.share(title1, title2, `http://192.168.1.84:3000/escape/finishPage/share/${this.props.match.params.activityId}/${userId}`, image);

      // window.delphy.share("天算，只赢不输的预测市场",'邀请您参加预测话题："' + marketDetailData.title + "链接：",`${delphyUrl}/finishPage/share/${
      //     this.props.match.params.activityId
      //   }/${title}/${nickname}`,
      //   squrieImg
      // );
    } else if (platform == 'imtoken') {
      webViewApi.share(
        '',
        title2,
        `${delphyUrl}escape/finishPage/share/${this.props.match.params.activityId}/${userId}`,
      );
    } else {
      Copy(
        `${title2},链接：` +
          `${delphyUrl}escape/finishPage/share/${this.props.match.params.activityId}/${userId}`,
      );
      showToast('已复制到粘贴板，请直接发送给您的好友', 2);
    }
  };

  render() {
    const { activityData, winnerList } = this.props.escapeData;
    let survivor = 0;

    let numInvestor = 0;

    let survivorChance: any = 0;

    let numOvercome: any = 0;

    let prize = 0;

    let failStage = 0;

    let reward = 0;

    let userStatus: number = 0;

    let image = '';

    let nickname = '';
    if ('cleanTime' in activityData) {
      numInvestor = activityData.numInvestor;
      survivor = activityData.survivor;
      prize = activityData.prize;
      numOvercome = activityData.numOvercome;
      failStage = activityData.failStage;
      nickname = activityData.nickname == null ? '' : activityData.nickname;
      image = activityData.image == null ? '' : activityData.image;
      userStatus = activityData.userStatus;
      reward = activityData.reward;
      numInvestor > 0
        ? (survivorChance = ((survivor / numInvestor) * 100).toFixed(2))
        : (survivorChance = 0);
      numInvestor > 0
        ? (numOvercome = ((numOvercome / numInvestor) * 100).toFixed(2))
        : (numOvercome = 0);
    }
    return (
      <div className="body-warp" style={{ minHeight: this.state.height }}>
        <Helmet>
          <title>吃鸡专场</title>
        </Helmet>
        <div className="endDel">
          <div className="endTop">
            <div className="endtop_top">
              <div className="endtop_top_left">
                <span className="yellow_color">{numInvestor}</span>
                <br />
                总参与人数
              </div>
              <div className="endtop_top_center">存活人数</div>
              <div className="endtop_top_right">
                <span className="yellow_color">{`${survivorChance * 1}%`}</span>
                <br />
                存活率
              </div>
            </div>
            <div className="endtop_saveperson">{survivor}</div>
          </div>
          {this.props.match.params.Nickname != undefined ? (
            userStatus === -1 ? null : (
              <div className="endMiddle">
                {activityData.userStatus == 0 && activityData.status == 2 ? (
                  <div>
                    <div className="middel_top">{`您的好友${nickname}坚持到了最后`}</div>
                    <div className="middel_middle">{`获得了${prize}DPY`}</div>
                  </div>
                ) : (
                  <div className="middel_top">
                    {`您的好友${nickname}撑到了第${failStage}轮,战胜了${numOvercome * 1}%的参与者`}
                  </div>
                )}
                <div className="middel_bottom" onClick={this.joinGame}>
                  马上参与
                </div>
              </div>
            )
          ) : userStatus === -1 ? null : (
            <div className="endMiddle">
              {activityData.userStatus == 0 && activityData.status == 2 ? (
                <div>
                  <div className="middel_top">您坚持到了最后</div>
                  <div className="middel_middle">{`获得了${prize}DPY`}</div>
                </div>
              ) : (
                <div className="middel_top">
                  {`你撑到了第${failStage}轮,战胜了${numOvercome * 1}%的参与者`}
                </div>
              )}
              <div
                className="middel_bottom"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.share(userStatus, activityData.status, reward, survivorChance, image);
                }}>
                分享战绩
              </div>
            </div>
          )}
          <div className="endfoot" />
        </div>
        <div className="winPersonOrder">
          <div className="winPersonOrder_title">获胜者名单</div>
          <div className="winPersonOrder_list">
            {winnerList.length > 0
              ? winnerList.map((item, index) => (
                  <div className="this_list" key={index}>
                    <img src={item.avatar} alt="头像" />
                    <p>{item.nickname}</p>
                  </div>
                ))
              : '暂无数据'}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({ escapeData: store.escapeFinishState });
const thisFinishPage = withRouter(FinishPage);
export default connect(mapStateToProps)(thisFinishPage);
