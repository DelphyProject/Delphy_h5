import React from 'react';
import './module.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { timestampToTime } from '../../../../utils/time';
import ShowTime from '../../../../components/showTime';
interface MyMarketConductType {
  item: any;
  rewardRule: any;
  win_shares: any;
}
type Props = MyMarketConductType & RouteComponentProps;
class MyMarketConduct extends React.Component<Props> {
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
      <div className="myMarketDetailsPage" onClick={this.marketUrl}>
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
                总份数
                {this.props.win_shares}
              </p>
            </div>
          </div>
        </div>
        {item.comment.name != null ? (
          <div className="conductComment clearfix">
            <div className="conductCommentLeft">
              <img src={item.comment.avatar} alt="" />
            </div>
            <div className="conductCommentRight">
              <p className="conductCommentName">
                {item.comment.name}{' '}
                <span>
                  {item.comment.isHave ? '持有' : '支持'}
                  {item.comment.description}
                </span>
              </p>
              <div className="conductCommentTime">
                <ShowTime time={item.comment.createTime} />
              </div>
              <p className="conductCommentInner">{item.comment.content}</p>
              <p
                className="conductCommentBtn"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.push(`/find/buy/${item.optionId}`);
                }}>
                继续支持
              </p>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
export default withRouter(MyMarketConduct);
