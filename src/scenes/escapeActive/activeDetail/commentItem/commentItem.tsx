import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isLogin } from '../../../../utils/tool';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import './commentItem.less';
import ShowTime from '../../../../components/showTime';
interface CommentItemProps {
  banBuy: any;
  zaned: any;
  data: any;
  typeId: number;
  holdOptionId: string;
  onChoose: any;
}
interface CommentItemState {
  commentId: number;
  isZaning: boolean;
  banBuy: boolean;
  zaned: boolean;
  buyAble: any;
  numZans: number;
}
type Props = CommentItemProps & DispatchProp & RouteComponentProps;
class CommentItem extends React.Component<Props, CommentItemState> {
  constructor(props) {
    super(props);
    this.state = {
      commentId: 12,
      isZaning: false,
      banBuy: this.props.banBuy,
      zaned: this.props.data.zaned,
      buyAble: null,
      numZans: this.props.data.numZans,
    };
  }

  componentWillMount() {
    if (this.props.data != '') {
      if (this.props.typeId == 1) {
        if (this.props.holdOptionId == null) {
          this.setState({
            buyAble: true,
          });
        } else if (this.props.holdOptionId == this.props.data.marketInfo.holdOption.id) {
          this.setState({
            buyAble: true,
          });
        } else {
          this.setState({
            buyAble: false,
          });
        }
      }
      if (this.props.typeId == 2) {
        if (this.props.holdOptionId == 'null') {
          this.setState({
            buyAble: true,
          });
        } else if (this.props.holdOptionId == this.props.data.marketInfo.holdOption.id) {
          this.setState({
            buyAble: true,
          });
        } else {
          this.setState({
            buyAble: false,
          });
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      banBuy: nextProps.banBuy,
      zaned: nextProps.data.zaned,
      numZans: nextProps.data.numZans,
    });
  }

  like = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (isLogin(true)) {
      this.props.dispatch(
        // @ts-ignore
        fetchData.likeComment(this.props.data.id, result => {
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
              type: fetchTypes.UPDATE_NEWESTCOMMENT,
              id: this.props.data.id,
              data: true,
            });
          } else {
            showToast('请求失败', 2);
          }
        }),
      );
    }
  };

  unlike = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (isLogin(true)) {
      this.props.dispatch(
        // @ts-ignore
        fetchData.unlikeComment(this.props.data.id, result => {
          this.setState({
            isZaning: false,
          });
          if (result.code == 200) {
            this.setState({
              zaned: false,
              numZans: this.state.numZans - 1,
            });
            showToast('取消点赞', 2);
            this.props.dispatch({
              type: fetchTypes.UPDATE_NEWESTCOMMENT,
              id: this.props.data.id,
              data: false,
            });
          } else {
            showToast('请求失败', 2);
          }
        }),
      );
    }
  };

  zanedMethod = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.isZaning) return;
    this.setState({
      isZaning: true,
    });
    if (this.state.zaned) {
      this.unlike(e);
    } else {
      this.like(e);
    }
  };

  ownBuyMethod = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const marketInfo = this.props.data.marketInfo;
    this.props.history.push(`/find/buy/${marketInfo.holdOption.id}`);
  };

  render() {
    const comment = this.props.data;
    let supportItem;
    if (this.props.data.creatorHold && this.props.data.creatorHold.length != 0) {
      supportItem = `持有${this.props.data.creatorHold}`;
    } else if (this.props.data.supportOptions && this.props.data.supportOptions.length != 0) {
      supportItem = `支持${this.props.data.supportOptions}`;
    } else {
      supportItem = '';
    }
    // 头像处胜率渲染函数
    const winRateRender = () => {
      if (this.props.data.statisticsVO) {
        switch (this.props.data.statisticsVO.grade) {
          case 'newbie':
            return <span className="level1">新手</span>;
            break;
          case 'white':
            return (
              <span className="level1">
                胜率
                {this.props.data.statisticsVO.winRate}
              </span>
            );
            break;
          case 'yellow':
            return (
              <span className="level2">
                胜率
                {this.props.data.statisticsVO.winRate}
              </span>
            );
            break;
          case 'red':
            return (
              <span className="level3">
                胜率
                {this.props.data.statisticsVO.winRate}
              </span>
            );
            break;
          default:
            return <span className="level1">胜率0%</span>;
            break;
        }
      } else {
        return <span className="level1">胜率0%</span>;
      }
    };
    return (
      <div
        className="commentItem paddingBom"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => {
          sessionStorage.setItem('comment', JSON.stringify(comment));
          this.props.history.push(`/comment/reply/${comment.id}`);
        }}>
        <div className="itemLeft">
          <img
            src={comment.creatorAvatar}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={e => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              this.props.history.push(`/me/otherProfile/${comment.creatorId}`);
            }}
          />
          {winRateRender()}
        </div>
        <div className="itemRight">
          <div className="top">
            <div className="left">
              <div className="nameBox">
                <p
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    if (this.props.onChoose) {
                      this.props.onChoose();
                    }
                  }}>
                  {comment.creatorName}
                </p>
                <p>{supportItem}</p>
              </div>
              <div className="p2">
                <ShowTime time={comment.time} />
              </div>
            </div>
            <div className="right">
              <span
                className={
                  this.state.zaned
                    ? 'iconfont icon-Byizan zaned'
                    : 'iconfont icon-Bweizan font-unlike'
                }
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  this.zanedMethod(e);
                }}
              />
              <span className="p3">{this.state.numZans}</span>
            </div>
          </div>
          <div className="mid">{comment.content}</div>
          <div className="bom">
            <div className="reply">回复 ({comment.numReply})</div>
          </div>
          <div className="line" />
        </div>
      </div>
    );
  }
}
const comment = withRouter(CommentItem);
const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});
export default connect(mapStateToProps)(comment);
