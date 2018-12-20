import React, { Component } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Route,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

import './router.less';
import Temp from './temp';
import testAPI from './testapi';
import PhonegapBar from './phonegapBar';
import { isStandalone } from '@/utils/device';
import Mymarket from '@/scenes/myMarketScene';
import Find from '@/scenes/findScene';
import me from '@/scenes/meScene';
import detail from '@/scenes/findScene/detailScene';
import comment from '@/scenes/other/commentScene';
import search from '@/scenes/other/search';
import login from '@/scenes/other/login';
import Future from '@/scenes/futureScene';
import Rank from '@/scenes/rankScene';
import Download from '@/scenes/download';
import Escape from '@/scenes/escapeActive';
import CommentApeal from '@/scenes/other/appeal/appeal';

interface MyRouterState {
  isTemp: boolean;
  data: string;
  title: string;
  showBack: boolean;
}

const Router = process.env.REACT_APP_ROUTER_MODE == 'hash' ? HashRouter : BrowserRouter;

let value;
class MyRouter extends Component<RouteComponentProps, MyRouterState> {
  public state: Readonly<MyRouterState> = {
    isTemp: false,
    data: '',
    title: '天算Delphy',
    showBack: false,
  };

  componentDidMount() {
    const pathname = this.props.history.location.pathname;
    setTimeout(() => {
      this.setState({
        showBack: pathname != '/' && pathname != '/find',
        title: window.document.title,
      });
    }, 300);
  }

  componentWillMount() {
    window.onReceiveJpush = msg => {
      const data = JSON.parse(msg);
      value = data;
      this.setState({
        isTemp:
          data.type == 1 || data.type == 3 || data.type == 4 || data.type == 5 || data.type == 6,
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    const pathname = nextProps.history.location.pathname;
    setTimeout(() => {
      if (pathname == '/' || pathname == '/find') {
        this.setState({
          showBack: false,
          title: window.document.title,
        });
      } else {
        this.setState({
          showBack: true,
          title: window.document.title,
        });
      }
    }, 300);
  }

  onBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { isTemp } = this.state;

    return (
      <Router>
        <div className="routerBox">
          {parent.isPhoneGap || isStandalone ? (
            <PhonegapBar
              title={this.state.title}
              onBack={this.onBack}
              showBack={this.state.showBack}
            />
          ) : (
            false
          )}
          <div className="routerBody">
            <Route path="/" component={isTemp ? TempPage : Find} />
            {/* <Route exact path="/" render={() => (
        isLogin() ?<Redirect to="/mymarket" />:  <Redirect to="/find" />)} /> */}
            {/* <Route exact path="/:id" render={() => ()} /> */}
            <Route path="/mymarket" component={Mymarket} />
            <Route path="/find" component={Find} />
            <Route path="/future" component={Future} />
            <Route path="/me" component={me} />
            <Route path="/market" component={detail} />
            <Route path="/comment" component={comment} />
            <Route path="/search" component={search} />
            <Route path="/testImtokenAPI" component={testAPI} />
            <Route path="/login" component={login} />
            <Route path="/rank" component={Rank} />
            <Route path="/commentApeal/:apeaId" component={CommentApealPage} />
            <Route exact={true} path="/download" component={DownloadPage} />
            <Route path="/escape" component={Escape} />
          </div>
        </div>
      </Router>
    );
  }
}

const DownloadPage = () => <Download />;

const CommentApealPage = () => <CommentApeal />;
const TempPage = () => <Temp data={value} />;

withRouter(MyRouter);

export default MyRouter;
