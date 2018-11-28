import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import Comments from './_comments';
import Input from '../input';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchType from '../../../../redux/actions/fetchTypes';
import './style.less';

import NotForecast from '../../../../components/notForecast';
import NotNetwork from '../../../../components/notNetwork';
import Loading from '../../../../components/loading';

let comment;
let commentNum = 1;
let page = 1;
let perPage = 30;
interface CommentPageProps {
  serverData: any;
  marketId: number;
}
interface CommentPageState {
  statusCode: boolean;
  isLoading: boolean;
  commentes: string;
  loading: boolean;
  loadingB: boolean;
}
type Props = CommentPageProps & DispatchProp;
class CommentPage extends React.Component<Props, CommentPageState> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: false,
      commentes: '',
      loading: false,
      isLoading: false,
      loadingB: false,
    };
  }

  componentWillMount() {
    page = 1;
    perPage = 20;
    this.props.dispatch({
      type: fetchType.CLEAR_COMMENTLIST_DATA,
    });
  }

  componentDidMount() {
    const params1 = {
      page,
      per_page: perPage,
      // 'order':'desc',
      // 'sortby':'time'
    };
    this.setState({
      isLoading: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchNewCommentList(this.props.marketId, params1, ret => {
        this.setState({
          isLoading: false,
        });
        if (ret.code == 200) {
          page++;
          if (ret.data && ret.data.length == perPage) {
            commentNum = 1;
            this.setState({
              commentes: '上滑加载更多',
              loading: false,
            });
          } else {
            this.setState({
              commentes: '没有更多数据了',
              loading: false,
            });
          }
        } else {
          commentNum = 1;
          this.setState({
            commentes: '上滑加载更多',
            loading: false,
          });
        }
      }),
    );
  }

  commentScroll = () => {
    comment = document.getElementById('comment');
    const { scrollTop } = comment;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(comment.clientHeight, comment.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(comment.scrollHeight, comment.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 10 && commentNum == 1) {
      commentNum = 2;

      this.setState({
        loadingB: true,
        commentes: '一大波评论正在袭来...',
      });
      const params = {
        page,
        per_page: perPage,
        // 'order':'desc',
        // 'sortby':'time'
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchNewCommentList(this.props.marketId, params, ret => {
          if (ret.code == 200) {
            if (ret.data && ret.data.length == perPage) {
              commentNum = 1;
              this.setState({
                commentes: '上滑加载更多',
                loading: false,
              });
              page++;
            } else {
              this.setState({
                commentes: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            commentNum = 1;
            this.setState({
              commentes: '上滑加载更多',
              loading: false,
            });
          }
        }),
      );
    }
  };

  render() {
    const { newComment, serverError } = this.props.serverData;
    const sCommentOptions: any = sessionStorage.getItem('commentOptions');
    const options: any = JSON.parse(sCommentOptions);
    const optionId: any = sessionStorage.getItem('holdOptionId');
    const status: any = sessionStorage.getItem('status');
    const invested: any = sessionStorage.getItem('invested');
    let option;
    options.forEach(val => {
      if (val.id == optionId) {
        option = val;
      }
    });

    let contentView;
    if (serverError) {
      contentView = <NotNetwork />;
    } else if (this.state.isLoading) {
      contentView = <Loading />;
    } else if (newComment.length == 0) {
      contentView = (
        <div className="noComment">
          <NotForecast title="暂无评论，快去发表第一条评论吧" titleTwo="" />
        </div>
      );
    } else {
      contentView = (
        <div>
          <Comments data={newComment} holdOptionId={optionId} ClassBordser="HotComments" />
          <div
            style={{
              textAlign: 'center',
              color: 'rgb(136, 147, 164)',
              paddingBottom: `${0.5}rem`,
              lineHeight: 3,
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
            {this.state.commentes}
          </div>
        </div>
      );
    }
    return (
      <div style={{ backgroundColor: '#fdfdfd' }} id="comment" onScroll={this.commentScroll}>
        <Helmet>
          <title>全部评论</title>
        </Helmet>
        {contentView}

        <Input
          type={2}
          commentId={this.props.marketId}
          optionId={optionId}
          option={option}
          options={options}
          marketStatus={status}
          invested={invested == 1}
        />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.commentState,
});
export default connect(mapStateToProps)(CommentPage);
