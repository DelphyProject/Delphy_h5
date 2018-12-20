import React from 'react';
import { showToast } from '@/utils/common';
import { Flex } from 'antd-mobile';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isLogin } from '@/utils/tool';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import './_commentItem.less';
import ShowTime from '@/components/showTime';
interface CommentItemProps {
  banBuy: boolean;
  data: any;
  typeId: number;
  holdOptionId: any;
  onChoose: any;
  status: number;
  loginAlert1: any;
}
interface CommentItemState {
  commentId: number;
  isZaning: boolean;
  banBuy: boolean;
  zaned: boolean;
  buyAble: any;
  numZans: number;
  isSupport: boolean;
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
      isSupport: true,
    };
  }

  componentWillMount() {
    const url = window.location.search;
    const theRequest = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      //@ts-ignore
      if (theRequest.escape != undefined && theRequest.escape != '') {
        //@ts-ignore
        if (theRequest.escape == 'q') {
          this.setState({ isSupport: false });
        }
      }
    }
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
        //@ts-ignore
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
        //@ts-ignore
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
    const triangleColor = 'RGBA(255, 153, 135, 1)';
    return (
      <div
        className="commentItemTop paddingBom"
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
        </div>
        <div className="itemRight">
          <div className="commentRightTop">
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
                {winRateRender()}
                <p className="support" style={{ background: triangleColor }}>
                  <span className="triangle" style={{ borderRightColor: triangleColor }} />
                  {supportItem}
                </p>
              </div>
              {/* <div className="p2">
                <ShowTime time={comment.time} />
              </div> */}
            </div>
            <div className="right">
              <span
                className={
                  this.state.zaned
                    ? 'iconfont icon-ic_good_press zaned'
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
          <div className="mid">{comment.content}</div>
          <div className="bom">
            <Flex>
              <ShowTime time={comment.time} />
            </Flex>
          </div>
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
