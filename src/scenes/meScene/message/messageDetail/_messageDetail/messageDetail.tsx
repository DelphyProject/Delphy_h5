import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './messageDetail.less';
import { formatTime } from '../../../../../utils/time';

interface MessageDetailProps {
  item: any;
  type: any;
  marketId: string;
}

type Props = MessageDetailProps & RouteComponentProps;
class MessageDetail extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="MessageDetail">
        {this.props.item.createTime ? (
          <div className="messageDate">
            <p>{formatTime(this.props.item.createTime, 'MM月DD日 HH:mm')}</p>
          </div>
        ) : (
          <div />
        )}

        <div className="messageItem">
          <div
            className="messageIcon"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              if (this.props.type == 1) {
                this.props.history.push('/me');
              } else if (this.props.type == 2) {
                this.props.history.push(`/find/topicDetail/${this.props.marketId}`);
              }
            }}>
            <div className="iconBox">
              <i className="delIcon icon-yemian iconfont" />
            </div>
          </div>

          <div className="messageContent">
            <div className="triangle" />
            <p className="content"> {this.props.item.content}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MessageDetail);
