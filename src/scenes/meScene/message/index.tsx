import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import MessageItem from './_messageItem';
import { CLEAR_MESSAGELIST } from '@/redux/actions/fetchTypes';
import './message.less';

interface MessagePageProps {
  serverData: any;
}
interface MessagePageState {
  switch: any;
  isRead: boolean;
  loading: boolean;
  tip: string;
  tipTwo: string;
  redDstate: boolean;
}
type Props = MessagePageProps & DispatchProp;
let messagePageScorll;
let messageNumOne = 1;
let messageNumTwo = 1;
let messagepageA = 1;
let messagepageB = 1;
let messageNumA = 1;
let messageNumB = 1;
const perPage = 10;
class MessagePage extends React.Component<Props, MessagePageState> {
  constructor(props) {
    super(props);
    const { switchCache } = props.serverData;
    this.state = {
      switch: switchCache,
      isRead: false,
      loading: false,
      tip: '',
      tipTwo: '',
      redDstate: false,
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: CLEAR_MESSAGELIST,
    });
  }

  componentDidMount() {
    // JSON.parse('{msgPreview:"",title:"举报与申诉",targetId:"M003",userId:92,msgCount:13,id:"5acf34668da8f1799eaa9bcd",type:1}')
    // JSON.parse('{"msgPreview":"","title":"举报与申诉","targetId":"M003","userId":92,"msgCount":13,"id":"5acf34668da8f1799eaa9bcd","type":1}')
    // socket.open()
    messagepageA = 1;
    messagepageB = 1;
    messageNumA = 1;
    messageNumB = 1;

    if (messageNumA == 1) {
      const params = {
        page: messagepageA,
        per_page: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMessageList(params, ret => {
          if (ret.code == 200) {
            // 请求成功后添加监听
            messageNumA++;
            messagepageA++;
            messageNumOne = 1;
            if (ret.data && ret.data.length == perPage) {
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
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
            // showToast(ret.msg,2,null,false)
          }
        }),
      );
    }
    if (messageNumB == 1) {
      const sysParams = {
        page: messagepageB,
        per_pag: perPage,
      };

      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchSysMessageList(sysParams, ret => {
          if (ret.code == 200) {
            messageNumB++;
            messagepageB++;
            messageNumTwo = 1;
            if (ret.data && ret.data.length == perPage) {
              this.setState({
                tipTwo: '上滑加载更多',
                loading: false,
              });
            } else {
              this.setState({
                tipTwo: '',
                loading: false,
              });
            }
          } else {
            this.setState({
              tipTwo: '数据加载失败',
              loading: false,
            });
          }
        }),
      );
    }
  }

  messageScroll = () => {
    messagePageScorll = document.getElementById('messagePage');
    // 获取页面卷入区域
    const scrollTop = messagePageScorll.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(messagePageScorll.clientHeight, messagePageScorll.clientHeight);
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(
      messagePageScorll.scrollHeight,
      messagePageScorll.scrollHeight,
    );

    if (this.state.switch) {
      if (scrollTop + clientHeight >= getScrollHeight - 10 && messageNumOne == 1) {
        messageNumOne = 2;

        const params = {
          page: messagepageA,
          per_page: perPage,
        };
        this.setState({
          loading: true,
          tip: '一大波消息正在袭来...',
        });
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchMessageList(params, ret => {
            if (ret.code == 200) {
              if (ret.data && ret.data.length == perPage) {
                messageNumOne = 1;
                this.setState({
                  tip: '上滑加载更多',
                  loading: false,
                });
                messagepageA++;
              } else {
                this.setState({
                  tip: '没有更多数据了',
                  loading: false,
                });
              }
            } else {
              messageNumOne = 1;
              this.setState({
                tip: '数据加载失败,请再次上滑',
                loading: false,
              });
            }
          }),
        );
      }
    } else if (scrollTop + clientHeight >= getScrollHeight - 10 && messageNumTwo == 1) {
      messageNumTwo = 2;

      const sysParams = {
        page: messagepageB,
        per_page: perPage,
      };

      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchSysMessageList(sysParams, ret => {
          if (ret.code == 200) {
            if (ret.data && ret.data.length == perPage) {
              messageNumTwo = 1;
              this.setState({
                tipTwo: '上滑加载更多',
                loading: false,
              });
              messagepageB++;
            } else {
              this.setState({
                tipTwo: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            messageNumTwo = 1;
            this.setState({
              tipTwo: '数据加载失败,请再次上滑',
              loading: false,
            });
          }
        }),
      );
    }
  };

  _setSmsRead() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.setMsgRead(result => {
        if (result.code == 200) {
          this.setState({
            isRead: true,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  _setRead() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.setMsgRead(result => {
        if (result.code == 200) {
          this.setState({
            isRead: true,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  render() {
    const { messageList, sysMessageList } = this.props.serverData;
    if (this.state.isRead) {
      messageList.forEach(val => {
        val.msgCount = 0;
      });
      sysMessageList.forEach(val => {
        val.msgCount = 0;
      });
    }
    let redDstateOne;
    if (messageList.length >= 1) {
      redDstateOne = messageList[0].msgCount;
    }
    let redDstateTwo;
    if (sysMessageList.length >= 1) {
      redDstateTwo = sysMessageList[0].msgCount;
    }
    return (
      <div>
        <Helmet>
          <title>消息</title>
        </Helmet>
        <div className="messagePage" onScroll={this.messageScroll} id="messagePage">
          <div className="messageTab">
            <ul>
              <li
                className={this.state.switch ? 'current' : 'once'}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.setState({
                    switch: true,
                  });
                  this.props.dispatch({
                    type: 'CACHE_MESSAGE_SWITCH_VRAIBLE',
                    data: true,
                  });
                }}>
                <p>
                  市场动态
                  {redDstateOne ? <s className="redD" /> : false}
                </p>
                <span />
              </li>
              <li
                className={!this.state.switch ? 'current' : 'once'}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.setState({
                    switch: false,
                  });
                  this.props.dispatch({
                    type: 'CACHE_MESSAGE_SWITCH_VRAIBLE',
                    data: false,
                  });
                }}>
                <p>
                  系统通知
                  {redDstateTwo ? <s className="redD" /> : false}
                </p>
                <span />
              </li>
            </ul>
          </div>

          <div className={this.state.switch ? 'messageOk' : 'messageNot'} id="findMarketA">
            <div className="messagelistTop ">
              <h5>通知列表</h5>
              <p
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this._setRead();
                }}>
                一键已读
              </p>
            </div>
            <div className="lineNotMar16" />
            {messageList.map((item, key) => (
              <MessageItem item={item} key={key} />
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
                  src={require('../../../img/tail-spin.svg')}
                  alt=""
                />
              ) : (
                false
              )}
              {this.state.tip}
            </div>
          </div>
          <div className={!this.state.switch ? 'messageOk' : 'messageNot'} id="findMarketB">
            <div className="messagelistTop ">
              <h5>通知列表</h5>
              <p
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this._setSmsRead();
                }}>
                一键已读
              </p>
            </div>
            <div className="lineNotMar16" />
            {sysMessageList.map((item, key) => (
              <MessageItem item={item} key={key} />
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
                  src={require('../../../img/tail-spin.svg')}
                  alt=""
                />
              ) : (
                false
              )}
              {this.state.tipTwo}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.messageState,
});

export default connect(mapStateToProps)(MessagePage);
