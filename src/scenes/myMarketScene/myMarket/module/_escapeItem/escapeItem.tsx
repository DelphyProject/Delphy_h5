import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './escapeItem.less';
import { formatTime } from '@/utils/time';
interface EscapeItemProps {
  data: any;
}
type Props = EscapeItemProps & RouteComponentProps;
class EscapeItem extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = this.props.data;
    const activityId = data.activityId;
    const reward = data.reward != undefined && data.reward != '' ? Number(data.reward) : 0; // 奖池
    const totalInvestor =
      data.numInvestor != undefined && data.numInvestor != '' ? Number(data.numInvestor) : 0; // 总参与人数
    const totalNumActivity =
      data.marketAmount != undefined && data.marketAmount != '' ? Number(data.marketAmount) : 0; // 活动总场次
    const currentStage =
      data.currentStage != undefined && data.currentStage != '' ? Number(data.currentStage) : 0; // 当前阶段数
    const currentProgress = `${currentStage}/${totalNumActivity}`; // 当前进度
    const survivor = data.survivor != undefined && data.survivor != '' ? data.survivor : 0; // 存活人数
    const prize = data.prize != undefined && data.prize != '' ? Number(data.prize) : 0; // 奖金
    const failStage =
      data.failStage != undefined && data.failStage != '' ? Number(data.failStage) : 0; // 第几场被淘汰

    let survivorRate; // 存活率
    if (totalInvestor == 0) {
      survivorRate = 0;
    } else {
      const rate = (survivor / totalInvestor) * 100;
      if (rate == 100) {
        survivorRate = 100;
      } else if (rate > 10) {
        survivorRate = rate.toFixed(1);
      } else if (rate == 0) {
        survivorRate = 0;
      } else {
        survivorRate = rate.toFixed(2);
      }
    }

    let tagView;
    let borderC = 'transparent';
    let path = '';
    switch (data.status) {
      case 0: // 未开始
        tagView = false;
        path = '/escape/activity/';
        break;
      case 1:
        if (data.userStatus == 0) {
          // 进行中 未淘汰
          tagView = false;
        } else if (data.userStatus == 1) {
          // 进行中 已淘汰
          tagView = <img className="tagImg" src={require('../../../../../img/chicken/out.png')} />;
          borderC = '#f00';
        } else if (data.userStatus == 2) {
          // 弃权
          tagView = false;
        } else {
          // -1的情况  弃权
          tagView = false;
        }
        path = '/escape/activeMarketList/';
        break;
      case 2: // 已结束 淘汰（吃鸡失败）
        if (data.userStatus == 0) {
          // 已结束 吃鸡（吃鸡成功）
          tagView = (
            <div className="tagLayout">
              <img className="tagImg" src={require('../../../../../img/chicken/victory.png')} />
              <p className="tip">
                获得
                {prize}
                DPY
              </p>
            </div>
          );
          borderC = 'green';
        } else if (data.userStatus == 1) {
          // 已结束 淘汰（吃鸡失败）
          tagView = (
            <div className="tagLayout">
              {' '}
              <img className="tagImg" src={require('../../../../../img/chicken/out1.png')} />
              <p className="tip">
                您在第
                {failStage}
                场淘汰
              </p>
            </div>
          );
          borderC = '#f00';
        } else if (data.userStatus == 2) {
          // 弃权
          tagView = (
            <div className="tagLayout">
              {' '}
              <img className="tagImg" src={require('../../../../../img/chicken/out1.png')} />
              <p className="tip">
                您在第
                {failStage}
                场淘汰
              </p>
            </div>
          );
          borderC = '#f00';
        } else {
          // -1的情况  未参与
          tagView = false;
        }
        path = '/escape/finishPage/h5/';
        break;
      case 10: // 已废止
        tagView = false;
        break;
      default:
        tagView = false;
        break;
    }
    return (
      <div className="escapeItemsBox">
        <div className="escaoeDate">-{formatTime(data.createTime, 'YYYY年MM月DD日')}-</div>
        <div
          className="escapeItems"
          style={{
            borderColor: borderC,
            background: `url("${data.image}") round`,
          }}
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (path != '') this.props.history.push(path + activityId);
          }}>
          {/* <img className="bgImg" src={data.image} /> */}
          <div className="escapeItem">
            {tagView}
            <div className="fillLayout" />
            <div className="layout1">
              <div className="bonusPool">
                <span>本期奖池</span>
                <span>
                  {reward}
                  DPY
                </span>
              </div>
              <div className="joinNum">
                <span>总参与人数</span>
                <span>{totalInvestor}人</span>
              </div>
              <div className="totalCount">
                <span>总场次</span>
                <span>{totalNumActivity}</span>
              </div>
            </div>
            {/* <div style={{height:1,background:bColor,marginLeft:10,marginRight:10}} /> */}
            <div className="layout2">
              <div className="progress">
                <span>进度</span>
                <span>{currentProgress}</span>
              </div>
              <div className="survival">
                <span>当前存活</span>
                <span>{survivor}人</span>
              </div>
              <div className="survivalRate">
                <span>存活率</span>
                <span>{survivorRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(EscapeItem);
