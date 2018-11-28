import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import ShowTime from '../../../../components/showTime';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import './_replyItem.less';
interface ReplyItemProps {
  data: any;
  length: number;
  dataS: any;
  onChoose: any;
}
interface ReplyItemState {
  zaned: boolean;
  commentId: number;
  numZans: number;
  isZaning: boolean;
}
type Props = ReplyItemProps & DispatchProp & RouteComponentProps;
class ReplyItem extends React.Component<Props, ReplyItemState> {
  constructor(props) {
    super(props);
    this.state = {
      zaned: this.props.data.zaned,
      commentId: 12,
      numZans: this.props.data.numZans,
      isZaning: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      zaned: nextProps.data.zaned,
      numZans: nextProps.data.numZans,
    });
  }

  like = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.likeReply(this.props.data.id, result => {
        this.setState({
          isZaning: false,
        });
        if (result.code == 200) {
          this.setState({
            zaned: true,
            numZans: this.state.numZans + 1,
          });
          showToast('点赞成功', 2);
          this.props.dispatch({
            type: fetchTypes.UPDATE_REPLY_LIKE,
            id: this.props.data.id,
            data: true,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  unlike = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.unlikeReply(this.props.data.id, result => {
        this.setState({ isZaning: false });
        if (result.code == 200) {
          showToast('取消点赞', 2);
          this.setState({
            zaned: false,
            numZans: this.state.numZans - 1,
          });
          this.props.dispatch({
            type: fetchTypes.UPDATE_REPLY_LIKE,
            id: this.props.data.id,
            data: false,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  zanedMethod = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.isZaning) return;
    this.setState({
      isZaning: true,
    });
    if (this.state.zaned) {
      this.unlike();
    } else {
      this.like();
    }
  };

  render() {
    const reply = this.props.data;
    const replyLength = this.props.length;
    const { dataS } = this.props;
    const winRateRender = () => {
      if (this.props.data.statisticsVO) {
        switch (this.props.data.statisticsVO.grade) {
          case 'newbie':
            return <span className="level1">新手</span>;
          case 'white':
            return <span className="level1">胜率 {this.props.data.statisticsVO.winRate}</span>;
          case 'yellow':
            return <span className="level2">胜率 {this.props.data.statisticsVO.winRate}</span>;
          case 'red':
            return <span className="level3">胜率 {this.props.data.statisticsVO.winRate}</span>;
          default:
            return <span className="level1">胜率0%</span>;
        }
      } else {
        return <span className="level1">胜率0%</span>;
      }
    };
    return (
      <div className="commentItem">
        <div className="itemLeft">
          <img
            src={reply.creatorAvatar}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.history.push(`/me/otherProfile/${reply.creatorId}`);
            }}
          />
          {winRateRender()}
          {/* <span className="level3">胜率10%</span> */}
        </div>
        <div className="itemRight">
          <div className="top">
            <div className="left">
              <div className="nameBox">
                <p
                  className="p1"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    if (this.props.onChoose) {
                      this.props.onChoose(reply);
                    }
                  }}>
                  {reply.creatorName}
                </p>
              </div>
              <div className="p2">
                <ShowTime time={reply.time} />
              </div>
            </div>
          </div>
          <div className="mid">
            {reply.toId > 0 ? (
              <span className="reply">
                回复
                <span className="toName">{reply.toName}：</span>
              </span>
            ) : (
              false
            )}
            <span className="content">{reply.content}</span>
          </div>
          <div className="itemRightBottom zanBox">
            <span
              className="report iconfont Group 1012 icon-Group3"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push(`/comment/1/${this.props.data.id}/impeach/`);
              }}
            />
            <div>
              <span
                className={
                  this.state.zaned
                    ? 'zanIcon iconfont icon-Byizan zaned'
                    : 'zanNo iconfont icon-Bweizan font-unlike'
                }
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  this.zanedMethod(e);
                }}
              />
              <span className="p3">{this.state.numZans}</span>
            </div>
          </div>
          {replyLength + 1 != dataS.length ? <div className="line" /> : false}
        </div>
      </div>
    );
  }
}

const reply = withRouter(ReplyItem);
const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});
export default connect(mapStateToProps)(reply);
