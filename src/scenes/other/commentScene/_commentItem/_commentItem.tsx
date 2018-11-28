import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import './_commentItem.less';
import ShowTime from '../../../../components/showTime';
import { isLogin } from '../../../../utils/tool';
interface CommentItemProps {
  data: any;
  onChoose: any;
}
interface CommentItemState {
  isZaning: boolean;
  commentId: number;
  isLike: boolean;
  numZans: number;
}
type Props = CommentItemProps & RouteComponentProps & DispatchProp;
class CommentItem extends React.Component<Props, CommentItemState> {
  constructor(props) {
    super(props);
    this.state = {
      isLike: this.props.data.zaned,
      commentId: 12,
      numZans: this.props.data.numZans,
      isZaning: false,
    };
  }

  like() {
    if (this.state.isZaning) return;
    this.setState({
      isZaning: true,
    });
    if (isLogin(true)) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.likeComment(this.props.data.id, result => {
          this.setState({ isZaning: false });
          if (result.code == 200) {
            showToast('点赞成功', 2);
            this.setState({
              isLike: !this.state.isLike,
              numZans: this.state.numZans + 1,
            });
          } else {
            showToast('请求失败', 2);
          }
        }),
      );
    }
  }

  unlike() {
    if (this.state.isZaning) return;
    this.setState({
      isZaning: true,
    });
    if (isLogin(true)) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.unlikeComment(this.props.data.id, result => {
          this.setState({
            isZaning: false,
          });
          if (result.code == 200) {
            showToast('取消点赞', 2);
            this.setState({
              isLike: !this.state.isLike,
              numZans: this.state.numZans - 1,
            });
          } else {
            showToast('请求失败', 2);
          }
        }),
      );
    }
  }

  // 头像处胜率渲染函数
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
      <div className="_commentItem noPaddingBom">
        <div className="itemLeft">
          <img
            src={comment.creatorAvatar}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
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
                  className="p1"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    if (this.props.onChoose) {
                      this.props.onChoose();
                    }
                  }}>
                  {comment.creatorName}
                </p>
                <div className="imgBox">{supportItem}</div>
              </div>
              <div className="p2">
                <ShowTime time={comment.time} />
              </div>
            </div>
            <div className="right">
              <span
                className={
                  this.state.isLike
                    ? 'iconfont icon-Byizan zaned'
                    : 'iconfont icon-Bweizan font-unlike'
                }
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.state.isLike ? this.unlike() : this.like();
                }}
              />
              <span className="p3">{this.state.numZans}</span>
            </div>
          </div>
          <div className="mid">{comment.content}</div>
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
