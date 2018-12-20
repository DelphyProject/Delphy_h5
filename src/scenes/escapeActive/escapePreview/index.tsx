import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { RouteComponentProps } from 'react-router-dom';
import './index.less';
import { showToast } from '@/utils/common';
import { formatTime } from '@/utils/time';
import { initNum } from '../commonjs/time';
interface TopicDetailProps {
  //
  serverData: any;
}
interface TopicDetailState {
  //
}
type Props = TopicDetailProps & RouteComponentProps & DispatchProp;
class EscapePreview extends React.Component<Props, TopicDetailState> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.getPreviewInfo(result => {
        if (result.code == 200) {
          //
          this.props.dispatch(
            //@ts-ignore
            fetchData.getWinnerList(result.data.activityId, 2),
          );
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }
  toHistoryRecord = () => {
    this.props.history.push('/escape/historyResult');
  };

  render() {
    const { previewInfo, winnerList } = this.props.serverData;
    const nextDate = previewInfo.nextDate
      ? formatTime(previewInfo.nextDate, 'MM月DD日')
      : '--月--日';
    return (
      <div id="marketDetailPage1">
        <Helmet>
          <title>吃鸡专场</title>
        </Helmet>
        <div className="chickenDinnerPreview">
          <div className="chickenstartDate">
            <div className="Title">
              本期将于
              {nextDate}
              开始
            </div>
            <div className="subTitle">话题准备中…</div>
          </div>
          <div className="prevList">
            <div className="prevChickenDinnerList">
              <div className="titleTop">
                <div className="subtitleTop" />
              </div>
              <div className="listTitle">
                <div className="listTitleLeft">
                  上期共
                  {initNum(previewInfo.totalUser)}
                  人参与，奖池共
                  {initNum(previewInfo.totalPrizePool)}
                  DPY， 共{initNum(previewInfo.winnerNum)}
                  人获奖，名单如下：
                </div>
                <div className="listTitleRight">
                  <div
                    className="icHistory icon-ic_history iconfont"
                    onClick={this.toHistoryRecord}
                  />
                </div>
              </div>
              <div className="thisList">
                {winnerList.map((item, index) => {
                  const styleName = index % 2 == 0 ? 'dataList dataListColor' : 'dataList';
                  return (
                    <div className={styleName} key={index}>
                      <img src={item.avatar} alt="头像" />
                      <div className="personName">{item.nickname}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.escapePreviewState,
});
export default connect(mapStateToProps)(EscapePreview);
