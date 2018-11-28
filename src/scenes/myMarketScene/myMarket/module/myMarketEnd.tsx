import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { timestampToTime } from '../../../../utils/time';
import './module.less';
interface MyMarketEndProps {
  item: any;
  rewardRule: any;
  win_shares: any;
  dpyLocked: number;
}
type Props = MyMarketEndProps & RouteComponentProps;
class MyMarketEnd extends React.Component<Props> {
  constructor(props) {
    super(props);
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
          {item.lock.map((item, i) => (
            <div className="detailsOptionInner" key={i}>
              {item.sure ? (
                <p>
                  <i className="icon-Group iconfont font-green" />
                  {item.description}
                </p>
              ) : (
                <p>
                  <i className="icon-Group2 iconfont font-orange" />
                  <s>{item.description}</s>
                </p>
              )}
              {item.buyCount ? (
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
              ) : (
                false
              )}
            </div>
          ))}
        </div>
        {item.sure ? (
          <div className="endProfit">
            <p>本次收益</p>
            <p>+{item.income == null ? '0.00' : item.income.toFixed(2)} DPY</p>
          </div>
        ) : item.lockMoney == 0 || item.marketType == 4 ? null : (
          <div className="endLoss">
            <p>
              锁定金额
              {item.lockMoney.toFixed(2)}
              DPY
            </p>
            <p
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                sessionStorage.setItem('lokedDPY', (this.props.dpyLocked - 0).toFixed(2));
                this.props.history.push('/me/lockdesc');
              }}>
              锁定说明
            </p>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(MyMarketEnd);
