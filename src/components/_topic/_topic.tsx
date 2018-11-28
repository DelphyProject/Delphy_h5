import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import TopicItem from './_topicItem/_topicItem';
import LoginAlert from '../loginAlert/loginAlert';
import EscapeItem from '@/scenes/myMarketScene/myMarket/module/_escapeItem/escapeItem';
import { getNowTimestamp } from '@/utils/time';

import './_topic.less';

interface TopicProps {
  data: any;
  saveScrollBool: any;
  typeId: any;
}

interface TopicState {
  isShow: boolean;
  isShow1: boolean;
  ableClick: boolean;
  favorateImg: string;
}

type Props = TopicProps & RouteComponentProps;

let loginState;
let effectiveTime;
let nowTime;
class Topic extends React.Component<Props, TopicState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      isShow1: false,
      ableClick: true,
      favorateImg: 'unfavorate.png',
    };
  }

  componentWillMount() {
    loginState = localStorage.getItem('loginState');
    effectiveTime = localStorage.getItem('effectiveTime');
  }

  toDetailPage = id => {
    if (this.props.saveScrollBool) {
      this.props.saveScrollBool();
    }
    this.props.history.push(`/find/topicDetail/${id}`);
  };

  loginAlert1 = () => {
    if (!loginState || !effectiveTime) {
      this.setState({
        isShow: true,
      });
      return false;
    }
    return this.loginAlert2();
  };

  loginAlert2 = () => {
    nowTime = getNowTimestamp();
    if (effectiveTime - nowTime <= 3) {
      this.setState({
        isShow1: true,
      });
      return false;
    }
    return true;
  };

  hideAlert = () => {
    this.setState({
      isShow: false,
      isShow1: false,
    });
  };

  render() {
    return (
      <div className="topicBox">
        {this.state.isShow ? (
          <LoginAlert info="你尚未登录，请登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {this.state.isShow1 ? (
          <LoginAlert info="账号信息过期，请重新登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {this.props.data ? (
          <div>
            {this.props.data.map((val, index) => {
              if (val.type == 2) {
                return <EscapeItem data={val} />;
              }
              return (
                <TopicItem
                  data={val}
                  key={index}
                  // unCollect={this.unCollect}
                  // collect={this.collect}
                  // dispatch={this.props.dispatch}
                  toDetailPage={this.toDetailPage}
                  loginAlert1={this.loginAlert1}
                  hideAlert={this.hideAlert}
                  typeId={this.props.typeId}
                />
              );
            })}
          </div>
        ) : (
          <div>没有相关市场</div>
        )}
      </div>
    );
  }
}

export default withRouter(Topic);
