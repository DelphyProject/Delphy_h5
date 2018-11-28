import React from 'react';
import './module.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { timestampToTime } from '../../../../utils/time';
interface MyMarketWaitProps {
  item: any;
  rewardRule: any;
  win_shares: any;
  dpyLocked: number;
}
type Props = MyMarketWaitProps & RouteComponentProps;
class MyMarketWait extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  marketUrl = () => {
    const { item } = this.props;
    this.props.history.push(`/find/topicDetail/${item.marketId}`);
  };

  render() {
    const { item } = this.props;
    //@ts-ignore
    const endTime = timestampToTime(item.endTime);
    let thisTitle;
    // tslint:disable-next-line:no-empty
    if (item.marketType == 3) {
    } else if (item.marketType == 4) {
      thisTitle = <span className="winnerTakeAll">赢者全拿</span>;
    } else if (item.marketType == 1) {
      thisTitle = <span className="winAndNotLose">只赢不输</span>;
    }
    return (
      <div
        className="myMarketDetailsPage"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => {
          this.marketUrl();
        }}>
        <h4>
          {thisTitle}
          {item.title}
        </h4>
        <div className="detailsTime">
          <p>
            <i className="iconfontMarket icon-Group4" /> {endTime}
          </p>
          <p className="imgBox">
            <span className="spanLeft">
              <i className="iconfontMarket icon-BNumberOfParticipant" /> {item.joinNum}
            </span>
            <span>
              <i className="iconfontMarket ic_jackpot icon-ic_jackpot" /> {this.props.rewardRule}
            </span>
          </p>
        </div>
        <div className="detailsOption">
          <div className="detailsOptionInner">
            <p>{item.description}</p>
            <div className="numStyleBox">
              <p className="numStyle">
                持有份数
                {item.buyCount}
              </p>
              <p className="numStyle">
                {' '}
                总份数
                {this.props.win_shares}
              </p>
            </div>
          </div>
        </div>
        <div className="waitProfit">
          <p>
            如果获胜可得奖励
            {item.income.toFixed(2)}
            DPY
          </p>
          <p>等待结果中</p>
        </div>
      </div>
    );
  }
}
export default withRouter(MyMarketWait);
