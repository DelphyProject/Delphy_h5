import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import './input.less';

let matchWords = 0;
interface ReplyInputProps {
  id: number;
  toUser: any;
  onCommented: any;
}
interface ReplyInputState {
  InputExpand: boolean;
  tid: string;
  content: string;
}
type Props = ReplyInputProps & DispatchProp;
class ReplyInput extends React.Component<Props, ReplyInputState> {
  constructor(props) {
    super(props);
    this.state = {
      InputExpand: false,
      tid: '',
      content: '',
    };
  }

  sendReply() {
    if (this.state.content.length <= 0) {
      showToast('内容不能为空', 2);
      return;
    }
    const params = {
      cid: this.props.id,
      tid: this.props.toUser ? this.props.toUser.creatorId : '',
      content: this.state.content,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.reply(params, result => {
        if (result.code == 200) {
          if (this.props.onCommented) {
            this.props.onCommented();
          }

          showToast('回复成功', 2);
        } else {
          showToast(result.msg, 2);
        }
        this.setState({
          InputExpand: false,
          content: '',
        });
        const newLocal: any = document.getElementById('replyPageM');
        newLocal.style.overflow = 'auto';
      }),
    );
  }

  // TODO: 抽象成工具方法
  getLength(str) {
    let realLength = 0;
    const len = str.length;
    let charCode = -1;
    for (let i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  }

  nameValueState = value => {
    let name;
    if (this.getLength(value) <= 500) {
      matchWords = value.trim().length;
      name = value;
    } else {
      name = value.slice(0, matchWords);
    }

    this.setState({
      content: name,
    });
  };

  render() {
    const { toUser } = this.props;
    const uid = localStorage.getItem('userId');
    return (
      <div id="replyInputOut">
        <div className="InputShrink">
          <p
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.setState({
                InputExpand: true,
              });
              const newLocal: any = document.getElementById('replyPageM');
              newLocal.scrollTop = 0;
              newLocal.style.overflow = 'hidden';
            }}>
            {toUser && toUser.creatorId != uid ? `回复${toUser.creatorName}` : '我来说两句'}
          </p>
        </div>
        {this.state.InputExpand == true ? (
          <div className="InputExpand">
            <div
              className="InputExpandMask"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  InputExpand: false,
                  content: '',
                });
                const newLocal: any = document.getElementById('replyPageM');
                newLocal.style.overflow = 'auto';
              }}
            />
            <div className="InputExpandPage">
              <div className="InputPageTop">
                <div
                  className="reCancel"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({
                      InputExpand: false,
                      content: '',
                    });
                  }}>
                  取消
                </div>
                <div
                  className="reLaunch"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.sendReply();
                  }}>
                  发布
                </div>
              </div>
              <div className="commentInputPageBot">
                <textarea
                  placeholder={
                    toUser && toUser.creatorId != uid ? `回复${toUser.creatorName}` : '我来说两句'
                  }
                  value={this.state.content}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={val => {
                    this.nameValueState(val.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.commentState,
  replayData: store.replyState,
  detailData: store.marketDetailState,
});
withRouter(ReplyInput);
export default connect(mapStateToProps)(ReplyInput);
