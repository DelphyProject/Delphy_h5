import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ShowTime from '../../../../components/showTime';
import './messageItem.less';

interface MessageItemProps {
  item: any;
}
type Props = MessageItemProps & RouteComponentProps;
class MessageItem extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    let messageIcon;
    if (item) {
      switch (item.targetId) {
        case 'M002':
          messageIcon = <img src={require('../../../../img/zhtz.png')} alt="" />;
          break;
        case 'M003':
          messageIcon = <img src={require('../../../../img/tsss.png')} alt="" />;
          break;
        case 'M004':
          messageIcon = <img src={require('../../../../img/tszs.png')} alt="" />;
          break;
        case 'G001':
          messageIcon = <img src={require('../../../../img/tstd.png')} alt="" />;
          break;
        default:
          messageIcon = <img src={require('../../../../img/tsxx.png')} alt="" />;
          break;
      }
    }
    let data: any = {
      msgId: this.props.item.id,
      marketId: this.props.item.targetId,
      type: this.props.item.type,
    };
    data = JSON.stringify(data);
    return (
      <div
        className="messageBox"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => this.props.history.push(`/me/message/${data}`)}>
        <div className="messageIcon">
          {messageIcon}
          {item.msgCount > 0 ? (
            <span className="messageNum">{item.msgCount >= 100 ? '99+' : item.msgCount}</span>
          ) : (
            false
          )}
        </div>
        <div className="messageRight">
          <div className="messageTitle">
            <span className="messageName">{item.title}</span>
            <div className="messageDate">
              <ShowTime time={item.time} />
            </div>
          </div>
          <div className="messageInner">
            <p>{item.msgPreview}</p>
          </div>
        </div>
        <div className="lineNotMar messageLine" />
      </div>
    );
  }
}

export default withRouter(MessageItem);
