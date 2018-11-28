import React from 'react';
import './_search.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface SearchTopProps {
  newsCount: number;
}
type Props = SearchTopProps & RouteComponentProps;
class SearchTop extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search">
        <div className="findTopBox">
          <div className="findTopLeft">
            <input
              placeholder="查找预测话题"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push('/search');
              }}
            />
            <i className="searchImg iconfontMarket icon-Bfaxiandingbusousuo" />
          </div>
          {/* <img className="messageImg" src={require('../../../../img/find/AMessage.png')} /> */}
          <span
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.history.push('/me/message');
            }}>
            {this.props.newsCount == 0 ? (
              <i className="iconfontFind icon-Group1" />
            ) : (
              <span className="am-badge x">
                <i className="iconfontFind icon-Group1" />
                <sup className="lightPoint am-badge-dot" />
              </span>
            )}
          </span>
          {/* <i class="icon_8 .icon-Group1s"></i> */}
        </div>
        <div className="midSlider" />
      </div>
    );
  }
}
export default withRouter(SearchTop);
