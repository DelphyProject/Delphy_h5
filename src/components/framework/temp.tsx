import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

interface LoadingProps {
  data: any;
}

type Props = LoadingProps & RouteComponentProps;

class Loading extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (window.onReceiveJpush) {
      window.onReceiveJpush('{"type":"999"}');
    }
    switch (this.props.data.type) {
      case '0': // 默认，h5端不做处理
        break;
      case '1': // 跳到指定市详情
        this.props.history.push(`/find/topicDetail/${this.props.data.id}`);
        break;
      case '2': // 跳到指定活动详情 暂时没有活动
        break;
      case '3': // 跳到资产清算页
        this.props.history.push('/mymarket');
        sessionStorage.setItem('myMarketStete', '3');
        break;
      case '4': // 跳到资产已结束
        this.props.history.push('/mymarket');
        sessionStorage.setItem('myMarketStete', '4');
        break;
      case '5': // 跳到系统通知
        this.props.history.push('/me/message');
        break;
      case '6': // 跳到收支记录
        this.props.history.push('/me/transactionRecord');
        break;
      default:
        // 其他情况
        break;
    }
  }

  render() {
    return <div className="loadingPage" />;
  }
}
export default withRouter(Loading);
