import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import MessageDetail from './_messageDetail/messageDetail';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import './_messageDetail/messageDetail.less';

interface MessageDetailPageProps {
  serverData: any;
  match: any;
}
interface MessageDetailPageState {
  loading: boolean;
  tip: string;
}
type Props = MessageDetailPageProps & DispatchProp;
let messageDetaiPagelNum = 1;
let messageDetailPageScorll;
let messageDetailpage = 1;
const perPage = 10;
let msgObj;
class MessageDetailPage extends React.Component<Props, MessageDetailPageState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tip: '',
    };
  }

  componentWillMount() {
    msgObj = JSON.parse(this.props.match.params.data);
    messageDetailpage = 1;
    this.props.dispatch({
      type: fetchTypes.CLEAR_MESSAGEDETAIL,
    });
  }

  componentDidMount() {
    const id = msgObj.msgId;
    const params = {
      page: messageDetailpage,
      pre_page: perPage,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMessageDetailList(id, params, ret => {
        if (ret.code == 200) {
          if (ret.data && ret.data.length == perPage) {
            this.setState({
              tip: '上滑加载更多',
              loading: false,
            });
            messageDetailpage++;
            messageDetaiPagelNum = 1;
          } else {
            this.setState({
              tip: '',
              loading: false,
            });
          }
        } else {
          this.setState({
            tip: '数据加载失败',
            loading: false,
          });
        }
      }),
    );
  }

  messageDetailScroll = () => {
    messageDetailPageScorll = document.getElementById('messageDetailPage');
    // 获取页面卷入区域
    const { scrollTop } = messageDetailPageScorll;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(
      messageDetailPageScorll.clientHeight,
      messageDetailPageScorll.clientHeight,
    );
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(
      messageDetailPageScorll.scrollHeight,
      messageDetailPageScorll.scrollHeight,
    );
    if (scrollTop + clientHeight >= getScrollHeight - 10 && messageDetaiPagelNum == 1) {
      const id = msgObj.msgId;

      messageDetaiPagelNum = 2;
      const params = {
        page: messageDetailpage,
        perPage,
      };
      this.setState({
        loading: true,
        tip: '一大波消息正在袭来...',
      });
      // var id = this.props.msgId
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMessageDetailList(id, params, ret => {
          if (ret.code == 200) {
            if (ret.data && ret.data.length == perPage) {
              messageDetaiPagelNum = 1;
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
              messageDetailpage++;
            } else {
              this.setState({
                tip: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            messageDetaiPagelNum = 1;
            this.setState({
              tip: '数据加载失败',
              loading: false,
            });
          }
        }),
      );
    }
  };

  render() {
    const { messageDetailList } = this.props.serverData;
    return (
      <div>
        <Helmet>
          <title>消息详情</title>
        </Helmet>
        <div
          className="messageDetailPage"
          onScroll={this.messageDetailScroll}
          id="messageDetailPage">
          {messageDetailList.map((item, key) => (
            <MessageDetail type={msgObj.type} marketId={msgObj.marketId} item={item} key={key} />
          ))}
          <div
            style={{
              textAlign: 'center',
              lineHeight: 3,
              color: 'rgb(136, 147, 164)',
              position: 'relative',
              top: 0,
            }}>
            {this.state.loading ? (
              <img
                width="20"
                style={{ marginRight: 15, position: 'relative', top: 4 }}
                src={require('../../../../img/tail-spin.svg')}
                alt=""
              />
            ) : (
              false
            )}
            {this.state.tip}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.messageDetailState,
});

export default connect(mapStateToProps)(MessageDetailPage);
