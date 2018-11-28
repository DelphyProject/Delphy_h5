import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { showToast } from '@/utils/common';
import { Helmet } from 'react-helmet';
import NotNetwork from '../../components/notNetwork';
import Tabs from '../../components/framework/tabs';
import * as fetchData from '../../redux/actions/actions_fetchServerData';
import { isLogin } from '../../utils/tool';
import './rank.less';
import { formatTime } from '../../utils/time';
interface RankProps {
  rankData: any;
}
interface RankState {
  periodCode: number;
  userId: any;
}
type Props = RankProps & DispatchProp;
class Rank extends React.Component<Props, RankState> {
  constructor(props) {
    super(props);
    this.state = {
      periodCode: 0,
      userId: isLogin(false) ? localStorage.getItem('userId') : -1,
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRank({ userId: this.state.userId, periodCode: this.state.periodCode }, ret => {
        // tslint:disable-next-line:no-empty
        if (ret.code == 200) {
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  render() {
    const { serverError } = this.props.rankData;
    return (
      <div>
        <Helmet>
          <title>排行榜</title>
        </Helmet>
        <Tabs />

        <div className="rank">
          <div className="marketTab">
            <ul>
              <li
                className={!this.state.periodCode ? 'current' : ''}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.setState({ periodCode: 0 }, () => {
                    this.getData();
                  });
                }}>
                <p>本期排行榜</p>
                <span />
              </li>
              <li
                className={this.state.periodCode ? 'current' : ''}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.setState({ periodCode: 1 }, () => {
                    this.getData();
                  });
                }}>
                <p>历史排行榜</p>
                <span />
              </li>
            </ul>
          </div>
          {serverError ? (
            <NotNetwork />
          ) : (
            <div>
              <div className="award">
                <img
                  src={require('../../img/rank_award.jpg')}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    window.location.href = 'https://jinshuju.net/f/PzXtnB';
                  }}
                />
              </div>
              <div className="myScore">
                <div>
                  <span className="score">
                    {this.props.rankData.myScore.mineRank
                      ? `第${this.props.rankData.myScore.mineRank}名`
                      : '─ ─'}
                  </span>
                  <span className="tit">我的排名</span>
                </div>
                <div>
                  <span className="score">
                    {this.props.rankData.myScore.mineCost
                      ? this.props.rankData.myScore.mineCost.toFixed(2)
                      : '─ ─'}
                  </span>
                  <span className="tit">盈利(DPY)</span>
                </div>
              </div>
              {!this.state.periodCode ? (
                <div className="endTime">下期活动暂未开始，敬请期待!</div>
              ) : (
                <div className="endTime">
                  本期结束时间：
                  {this.props.rankData.myScore.endTime
                    ? formatTime(this.props.rankData.myScore.endTime, 'YYYY.MM.DD HH:mm:ss')
                    : ''}
                </div>
              )}
              <div className="detail">
                <ul>
                  <li className="header">
                    <span>名次</span>
                    <span>用户名</span>
                    <span>盈利</span>
                  </li>
                </ul>
                {this.props.rankData.list == null || this.props.rankData.list.length == 0 ? (
                  <div className="noData">
                    <img src={require('../../img/rank_no_data.png')} alt="" />
                    <br />
                    <span className="tip">活动刚开始，还未统计数据！（数据每天0点更新）</span>
                  </div>
                ) : (
                  <ul>
                    {this.props.rankData.list.map((val, i) => {
                      const value =
                        val.rank <= 10 ? (
                          <li key={i}>
                            {val.rank <= 3 ? (
                              <span className={`order_${val.rank}`}>&nbsp;</span>
                            ) : (
                              <span className="order">{val.rank}</span>
                            )}
                            <span>{val.userName}</span>
                            <span className="num rAligin">
                              {val.cost.toFixed(2)}
                              <i>DPY</i>
                              <em>&nbsp;</em>
                            </span>
                          </li>
                        ) : (
                          ''
                        );
                      return value;
                    })}

                    {this.props.rankData.list[this.props.rankData.list.length - 1].rank > 10 ? (
                      <li>
                        <span className="order">&nbsp;</span>
                        <span className="blank">&nbsp;</span>
                        <span className="num">&nbsp;</span>
                      </li>
                    ) : (
                      ''
                    )}
                    {this.props.rankData.list[this.props.rankData.list.length - 1].rank > 10 ? (
                      <li>
                        <span className="order">
                          {}
                          {this.props.rankData.list[this.props.rankData.list.length - 1].rank}
                        </span>
                        <span>
                          {this.props.rankData.list[this.props.rankData.list.length - 1].userName}
                        </span>
                        <span className="num rAligin">
                          {this.props.rankData.list[
                            this.props.rankData.list.length - 1
                          ].cost.toFixed(2)}
                          <i>DPY</i>
                          <em>&nbsp;</em>
                        </span>
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
                )}
              </div>
              <div className="statisticsTime">
                当前数据统计时间：
                {this.props.rankData.myScore.statTime
                  ? formatTime(this.props.rankData.myScore.statTime, 'YYYY.MM.DD HH:mm:ss')
                  : ''}
                {this.state.periodCode ? '' : ' (数据每天0点更新)'}
              </div>

              <div className="readHeader">活动规则</div>
              <div className="readerContent firstItem">
                1.
                活动期间，用户通过使用系统赠送的500测试币，进行竞话题预测。胜利可获得相应收益，失败则损失投注本金。
              </div>
              <div className="readerContent noFirstItem">
                2. 活动期间，每次开启后将以当前用户测试币余额为准，清空之前收益，更新预测排行榜。
              </div>
              <div className="readerContent noFirstItem">
                3 .若有话题在活动截止时尚未结算，其收益数据将不纳入此活动期间收益。
              </div>
              <div className="readerContent noFirstItem">
                4.活动期间，若没有项目完成结算，则不计入排名。
              </div>
              <div className="readerContent noFirstItem">
                5.盈利展现小数点后两位数字。若展现金额一致但名次不同，是小数点三位后数值不同导致的。
              </div>

              <div className="readHeader">活动奖励</div>
              <div className="readerContent firstItem">
                以活动结束当天24点排名为最终排名，并以此进行奖励发放。
              </div>

              <div className="readHeader">排名奖励</div>
              <div className="readerContent firstItem">
                第1名：奖励66DPY。
                <br />
                第2~10名：奖励36DPY。
                <br />
                第10~100名：奖励6DPY。
                <br />
                排名奖励将在活动结束后1-7个工作日发放到用户账户。
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  rankData: store.rankState,
});

export default connect(mapStateToProps)(withRouter(Rank));
