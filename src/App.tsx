import React, { Component } from 'react';
import { connect, Provider, DispatchProp } from 'react-redux';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import store from './redux/store/store';
import Router from './components/framework/routerBox';
import * as fetchData from './redux/actions/actions_fetchServerData';
import { socketUrl, channelId } from './config/index';

interface AppState {
  channelId: string;
  isPhoneGap: boolean;
  statisticId: string;
}

class App extends Component<DispatchProp, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      channelId,
      isPhoneGap: !!parent.isPhoneGap,
      statisticId: localStorage.getItem('statisticId') || '',
    };
  }

  componentWillMount() {
    const userId = localStorage.getItem('userId');
    if (!localStorage.getItem('newPlayWayInstroductTime')) {
      localStorage.setItem('newPlayWayInstroductTime', String(+new Date()));
    }
    if (userId) {
      if (window.delphy && window.delphy.jsToAndUserId) {
        window.delphy.jsToAndUserId(userId);
      } else if (this.state.isPhoneGap) {
        parent.setJpushAlias(userId);
      }
    }
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      window.iosPlatform = true;
    }
    window.socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 80000,
    });
    // window.tranSocket = io(tranSocketUrl, {
    //   reconnection: true,
    //   reconnectionDelay: 80000
    // })
    // window.tranSocket.on('connect', () => {
    // })

    if (window.imToken) {
      //
    } else {
      window.addEventListener('sdkReady', () => {
        // run your code
        if (window.imToken) {
          localStorage.setItem('platform', 'imtoken');
        }
      });
    }
    const url = window.location.search;
    const theRequest = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      if (theRequest['c']) {
        sessionStorage.setItem('channelId', theRequest['c']);
        this.setState({
          channelId: theRequest['c'],
        });
      } else if (!sessionStorage.getItem('channelId')) {
        sessionStorage.setItem('channelId', channelId);
      }
    } else if (!sessionStorage.getItem('channelId')) sessionStorage.setItem('channelId', channelId);

    const statisticId = localStorage.getItem('statisticId');
    if (statisticId) {
      this.addStatistic(20201); // 正常打开h5
    } else {
      this.getStatisticId();
    }
  }

  getStatisticId = () => {
    this.props.dispatch(
      // @ts-ignore
      fetchData.getStatisticId(ret => {
        if (ret.code == 200) {
          localStorage.setItem('statisticId', ret.data);
          this.addStatistic(10201); // 第一次打开h5
          this.addStatistic(20201); // 正常打开h5
        }
      }),
    );
  };

  addStatistic = actionId => {
    const sId = localStorage.getItem('statisticId');
    if (!sId) return;
    const phone = localStorage.getItem('username');
    const params = {
      statisticId: sId,
      action: actionId, // 动作编号,后台配置提供
      phone: phone || '',
      val1: sessionStorage.getItem('channelId'), // 渠道号
    };
    this.props.dispatch(
      // @ts-ignore
      fetchData.addStatistic(params, ret => {
        //
      }),
    );
  };

  render() {
    return (
      <div className="App">
        <Router />
      </div>
    );
  }
}

const mapStateToProps = () => ({
  // @ts-ignore
  serverData: store.findPageState,
});
// let a={

//   serverData: store.findPageState,
// }
const Main = connect(mapStateToProps)(App);

const AppWithRedux = () => (
  <Provider store={store}>
    <Main />
  </Provider>
);

export default hot(module)(AppWithRedux);
