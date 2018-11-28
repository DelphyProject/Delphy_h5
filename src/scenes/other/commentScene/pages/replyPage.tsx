import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchType from '../../../../redux/actions/fetchTypes';
import Input from '../input';
import Comment from '../_commentItem/_commentItem';
import Replys from './_replys';
import NotNetwork from '../../../../components/notNetwork';
import Loading from '../../../../components/loading';

let replyPageM;
let replyNum = 1;
let page = 1;
const perPage = 20;
interface ReplyPageProps {
  serverData: any;
  commentId: number;
}
interface ReplyPageState {
  nameState: boolean;
  toUser: any;
  loading: boolean;
  isLoading: boolean;
  replys: string;
  commentState: boolean;
}
type Props = ReplyPageProps & DispatchProp;
class ReplyPage extends React.Component<Props, ReplyPageState> {
  constructor(props) {
    super(props);
    this.state = {
      nameState: true,
      toUser: null,
      loading: false,
      isLoading: false,
      replys: '上滑加载更多...',
      commentState: true,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: fetchType.CLEAR_REPLYLIST_DATA,
    });
    page = 1;
    if (page == 1) {
      const params = {
        page,
        per_page: perPage,
        order: 'desc',
        sortby: 'time',
      };

      this.setState({
        isLoading: true,
      });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchReplyListData(params, this.props.commentId, ret => {
          this.setState({
            isLoading: false,
          });
          if (ret.code == 200) {
            page++;
            if (ret.data && ret.data.length == perPage) {
              this.setState({
                replys: '上滑加载更多',
                loading: false,
              });
              replyNum = 1;
            } else {
              this.setState({
                replys: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            replyNum = 1;
            this.setState({
              replys: '上滑加载更多',
              loading: false,
            });
          }
        }),
      );
    }
  }

  onChoose = val => {
    this.setState({
      toUser: val,
    });
  };

  onChooseComment() {
    this.setState({
      toUser: null,
    });
  }

  onCommented = () => {
    this.setState({
      toUser: null,
    });
  };

  replyScroll = () => {
    replyPageM = document.getElementById('replyPageM');
    const { scrollTop } = replyPageM;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(replyPageM.clientHeight, replyPageM.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(replyPageM.scrollHeight, replyPageM.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 10 && replyNum == 1) {
      replyNum = 2;
      this.setState({
        loading: true,
        replys: '一大波评论正在袭来...',
      });
      const params = {
        page,
        per_page: perPage,
        order: 'desc',
        sortby: 'time',
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchReplyListData(params, this.props.commentId, ret => {
          if (ret.code == 200) {
            if (ret.data && ret.data.length == perPage) {
              replyNum = 1;
              this.setState({
                replys: '上滑加载更多',
                loading: false,
              });
              page++;
            } else {
              this.setState({
                replys: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            replyNum = 1;
            this.setState({
              replys: '上滑加载更多',
              loading: false,
            });
          }
        }),
      );
    }
  };

  render() {
    const { allReply, serverError } = this.props.serverData;
    const sComment: any = sessionStorage.getItem('comment');
    const comment = JSON.parse(sComment);
    let contentView;
    if (serverError) {
      contentView = <NotNetwork />;
    } else if (this.state.isLoading) {
      contentView = <Loading />;
    } else {
      contentView = (
        <div>
          <Comment data={comment} />
          <Replys data={allReply} onChoose={this.onChoose} ClassBordser="HotComments" />
          <Input
            title="写回复"
            type={1}
            onCommented={this.onCommented}
            replyId={this.props.commentId}
            toUser={this.state.toUser}
          />
          {allReply != 0 ? (
            <div
              style={{
                textAlign: 'center',
                lineHeight: 2,
                color: 'rgb(136, 147, 164)',
                paddingBottom: `${0.5}rem`,
              }}>
              {this.state.loading ? (
                <img
                  width="20"
                  style={{ marginRight: 10, position: 'relative', top: 4 }}
                  src={require('../../../../img/tail-spin.svg')}
                  alt=""
                />
              ) : (
                false
              )}
              {this.state.replys}
            </div>
          ) : (
            false
          )}
        </div>
      );
    }

    return (
      // tslint:disable-next-line:jsx-no-bind
      <div className="replyPageM" id="replyPageM" onScroll={this.replyScroll.bind(this)}>
        <Helmet>
          <title>回复</title>
        </Helmet>
        {contentView}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.replyState,
});
withRouter(ReplyPage);
export default connect(mapStateToProps)(ReplyPage);
