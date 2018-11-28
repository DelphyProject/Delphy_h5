import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './recommentd.less';
import CountDown from '../../findScene/detailScene/components/_countDown';
import { getNowTimestamp } from '@/utils/time';
interface CommentsProps {
  data: any;
  index: number;
  datas: Array<any>;
}
type Props = CommentsProps & RouteComponentProps;
class Comments extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: false,
    };
  }

  render() {
    const { history, data } = this.props;
    return (
      <div className="Comments">
        <dl
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            history.push(`/market/${data.id}`);
          }}>
          {this.props.data.avatar.length != 0 ? (
            <dd>
              <img src={this.props.data.avatar} alt="" />
            </dd>
          ) : (
            <dd>
              <img src={require('../../../img/my_photo_none.png')} alt="" />
            </dd>
          )}
          <dt>
            <h4>
              {this.props.data.name}
              <span>{this.props.data.description}</span>{' '}
            </h4>
            {/* <i>{this.props.data.endTime}</i> */}
            <p>{this.props.data.content}</p>
            <pre>
              剩余时间:
              {this.props.data.endTime ? (
                <CountDown date={this.props.data.endTime - getNowTimestamp()} getData={undefined} />
              ) : (
                false
              )}
            </pre>
            {this.props.index != this.props.datas.length - 1 ? (
              <div className="lineNotMar" />
            ) : (
              false
            )}
          </dt>
        </dl>
      </div>
    );
  }
}

export default withRouter(Comments);
