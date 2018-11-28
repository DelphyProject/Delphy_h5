import React from 'react';
import './index.less';
import ReactDOM from 'react-dom';
import { connect, DispatchProp } from 'react-redux';
import { PullToRefresh } from 'antd-mobile';
import { cancelRequest } from '@/utils/request';
import Card from '@/components/_topic/_topicItem/_topicItem';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import LoginAlert from '@/components/loginAlert/loginAlert';
import { getNowTimestamp } from '@/utils/time';

let loginState;
let effectiveTime;
let nowTime;

interface HotCoinMarketProps {
  serverData: any;
  upPull: any;
  updateNewPage: any;
  page: number;
}
interface HotCoinMarketState {
  refreshing: boolean;
  down: boolean;
  height: any;
  page: number;
  isShow: boolean;
  isShow1: boolean;
}
type Props = HotCoinMarketProps & DispatchProp & RouteComponentProps;
class HotCoinMarket extends React.Component<Props, HotCoinMarketState> {
  ptr: any;
  constructor(props) {
    super(props);
    const thisDocument: any = document.documentElement;
    this.state = {
      refreshing: false,
      down: false,
      height: thisDocument.clientHeight,
      page: this.props.page,
      isShow: false,
      isShow1: false,
    };
  }
  componentDidMount() {
    loginState = localStorage.getItem('loginState');
    effectiveTime = localStorage.getItem('effectiveTime');
    const thisDom: any = ReactDOM.findDOMNode(this.ptr);
    // eslint-disable-next-line
    const hei = this.state.height - thisDom.offsetTop - 50;
    this.setState({
      height: hei,
    });
  }
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
  componentWillReceiveProps(nextProps) {
    this.setState({
      page: this.props.page,
    });
  }
  toMarketDetail = id => {
    //
    this.props.history.push(`/find/topicDetail/${id}`);
  };
  upPull = () => {
    const params = {
      page: this.state.page,
      per_page: 10,
    };
    this.setState({ refreshing: true });
    cancelRequest();
    this.props.dispatch(
      //@ts-ignore
      fetchData.getNewCoinList(params, result => {
        this.setState({
          refreshing: false,
        });
        if (result.data.length > 0) {
          this.props.updateNewPage();
        }
      }),
    );
  };
  render() {
    const { newList } = this.props.serverData;
    return (
      <div className="newCoinMarketPage">
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
        <PullToRefresh
          damping={60}
          ref={el => {
            this.ptr = el;
          }}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          distanceToRefresh={25}
          onRefresh={this.upPull}>
          {newList.map((item, index) => {
            return (
              <Card
                data={item}
                key={index}
                loginAlert1={this.loginAlert1}
                toDetailPage={this.toMarketDetail}
              />
            );
          })}
        </PullToRefresh>
      </div>
    );
  }
}
const mapStateToProps = store => ({ serverData: store.futureMarket });
export default connect(mapStateToProps)(withRouter(HotCoinMarket));
