import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CommentInput from './commentInput';
import ReplyInput from './replyInput';
interface InputProps {
  type: number;
  replyId: number;
  toUser: any;
  onCommented: any;
  commentId: number;
  optionId: number;
  invested: boolean;
  options: any;
  marketStatus: any;
}
class Input extends React.Component<InputProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let commentInput;
    if (this.props.type == 1) {
      commentInput = (
        <ReplyInput
          id={this.props.replyId}
          toUser={this.props.toUser}
          onCommented={this.props.onCommented}
        />
      );
    } else if (this.props.type == 2) {
      commentInput = (
        <CommentInput
          holdOptionId={this.props.optionId}
          id={this.props.commentId}
          invested={this.props.invested}
          options={this.props.options}
          status={this.props.marketStatus}
        />
      );

      // <CommentInput id={this.props.commentId} option={this.props.option} optionId={this.props.optionId} invested={this.props.invested} options={this.props.options} marketStatus={this.props.marketStatus} />
    }
    return <div>{commentInput}</div>;
  }
}
const mapStateToProps = store => ({
  serverData: store.commentState,
  replayData: store.replyState,
  detailData: store.marketDetailState,
});
withRouter(Input);
export default connect(mapStateToProps)(Input);
