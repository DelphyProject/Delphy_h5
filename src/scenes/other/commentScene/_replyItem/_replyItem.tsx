import React from 'react';
import { Flex } from 'antd-mobile';
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
    // 头像处胜率渲染函数
    const winRateRender = () => {
      let imgSrc;
      let content;
      if (this.props.data.statisticsVO) {
        switch (this.props.data.statisticsVO.grade) {
          case 'newbie':
            imgSrc = require('@/img/future/ic_copper.png');
            content = '新手';
            break;
          case 'white':
            imgSrc = require('@/img/future/ic_copper.png');
            content = this.props.data.statisticsVO.winRate;
            break;
          case 'yellow':
            imgSrc = require('@/img/future/ic_silver.png');
            content = this.props.data.statisticsVO.winRate;
            break;
          case 'red':
            imgSrc = require('@/img/future/ic_gold.png');
            content = this.props.data.statisticsVO.winRate;
            break;
          default:
            imgSrc = require('@/img/future/ic_copper.png');
            content = '0%';
            break;
        }
        return (
          <Flex direction="row" className="winningRate">
            <img src={imgSrc} alt="胜率" />
            <span>{content}</span>
          </Flex>
        );
      } else {
        return null;
      }
    };
    return (
      <div className="replyItem">
        <div className="itemLeft">
          <img
            src={reply.creatorAvatar}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.history.push(`/me/otherProfile/${reply.creatorId}`);
            }}
          />
        </div>
        <div className="itemRight">
          <div className="itemRTop">
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
                {winRateRender()}
              </div>
            </div>
            <div className="right">
              <span
                className={
                  this.state.zaned
                    ? 'iconfont icon-ic_good_press font-like'
                    : 'iconfont icon-ic_good font-unlike'
                }
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  this.zanedMethod(e);
                }}
              />
              <span className="p3">{this.state.numZans}</span>
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
            <ShowTime time={reply.time} />
            <div
              className="report iconfont icon-Group3"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push(`/comment/1/${this.props.data.id}/impeach/`);
              }}>
              <span>举报</span>
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
