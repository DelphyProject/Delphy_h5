import React, { MouseEvent } from 'react';
import './module.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { timestampToTime } from '../../../../utils/time';
interface MyMarketClearType {
  item: any;
  rewardRule: any;
  win_shares: any;
}
interface MyMarketClearState {
  Appeal: number;
}
type Props = MyMarketClearType & RouteComponentProps;
class MyMarketClear extends React.Component<Props, MyMarketClearState> {
  constructor(props) {
    super(props);
    this.state = {
      Appeal: 1,
    };
  }

  componentWillMount() {
    const { item } = this.props;
    this.setState({
      Appeal: item.isObject,
    });
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
            <p>
              {item.sure ? (
                <i className="icon-Group iconfont font-green" />
              ) : (
                <i className="icon-Group2 iconfont font-orange" />
              )}
              {item.description}
            </p>
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
        {!item.sure ? (
          <div className="ClearYesOption clearfix">
            {item.dealRet.map((item, i) => (
              <div key={i} className="ClearYesOptionLeft">
                {item.sure ? (
                  <p>
                    <span>正确选项</span>
                    {item.description}
                  </p>
                ) : (
                  false
                )}
              </div>
            ))}
            <div className="ClearYesOptionRight">
              {!this.state.Appeal ? (
                <p
                  className="appealNo"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    this.props.history.push(`/mymarket/appeal/${item.marketId}`);
                  }}>
                  进行申诉
                </p>
              ) : (
                <p className="appealYes">已经申诉</p>
              )}
            </div>
          </div>
        ) : (
          <div className="ClearYesOption clearfix">
            {item.dealRet.map((item, i) => (
              <div key={i} className="ClearYesOptionLeft">
                {item.sure ? (
                  <p>
                    <span>本次收益</span>+{item.income.toFixed(2)} DPY
                  </p>
                ) : (
                  false
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(MyMarketClear);
