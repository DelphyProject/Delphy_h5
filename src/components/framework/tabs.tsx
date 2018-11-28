import { TabBar } from 'antd-mobile';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';

import '../../style/tabs.less';
import * as fetchData from '../../redux/actions/actions_fetchServerData';

interface TabBarProps {
  newsData: any;
}

interface TabBarState {
  selectedTab: string;
  hidden: boolean;
}

type Props = TabBarProps & RouteComponentProps & DispatchProp;

const mapStateToProps = store => ({
  serverData: store.mePageState,
  newsData: store.news,
});

class MyTabBar extends React.Component<Props, TabBarState> {
  constructor(props) {
    super(props);
    const { location } = props;
    let selectedTab;
    switch (location.pathname) {
      case '/':
        selectedTab = 'findTab';
        break;
      case '/mymarket':
        selectedTab = 'mymarketTab';
        break;
      case '/future':
        selectedTab = 'futureTab';
        break;
      case '/rank':
        selectedTab = 'rankTab';
        break;
      case '/me':
        selectedTab = 'meTab';
        break;
      default:
        selectedTab = 'findTab';
        break;
    }
    if (location.pathname.substring(0, 3) == '/me') selectedTab = 'meTab';

    this.state = {
      selectedTab,
      hidden: false,
    };
  }

  componentDidMount() {
    // @ts-ignore
    this.props.dispatch(fetchData.showBanner());
  }

  componentWillUnmount() {
    if (localStorage.getItem('userId')) {
      // socket.off(localStorage.getItem('userId')+'_notify');
      // socket.removeListener(localStorage.getItem('userId')+'_notify');
    }
  }

  setTopNum() {
    sessionStorage.setItem('topNum1Bool', '0');
    sessionStorage.setItem('topNum2Bool', '0');
    sessionStorage.setItem('topNum3Bool', '0');
    sessionStorage.setItem('topNum4Bool', '0');
    sessionStorage.setItem('topNum5Bool', '0');
  }

  handleMyMarketTabPress = () => {
    this.setState({ selectedTab: 'mymarketTab' });
    this.setTopNum();
    this.props.history.push('/mymarket');
  };

  handleFindTabPress = () => {
    this.setState({ selectedTab: 'findTab' });
    this.setTopNum();
    this.props.history.push('/find');
  };

  handleMineTabPress = () => {
    this.setState({ selectedTab: 'meTab' });
    this.setTopNum();
    this.props.history.push('/me');
  };

  handleFutureTabPress = () => {
    this.setState({ selectedTab: 'futureTab' });
    this.setTopNum();
    this.props.history.push('/future');
  };
  handleRankTabPress = () => {
    this.setState({ selectedTab: 'rankTab' });
    this.setTopNum();
    this.props.history.push('/rank');
  };
  render() {
    const { newsCount } = this.props.newsData;
    return (
      <div className="tabs">
        <TabBar
          unselectedTintColor="#696969"
          tintColor="#FF8647"
          barTintColor="white"
          hidden={this.state.hidden}>
          <TabBar.Item
            key="my"
            title="资产"
            icon={<div className="icon-ic_mypredicte iconfont unSelected" />}
            selectedIcon={<div className="iconfont icon-ic_mypredicte bgChange" />}
            selected={this.state.selectedTab == 'mymarketTab'}
            onPress={this.handleMyMarketTabPress}
            data-seed="logId"
          />
          <TabBar.Item
            key="find"
            title="发现"
            icon={<div className="iconfont icon-ic_discover unSelected" />}
            selectedIcon={<div className="iconfont icon-ic_discover bgChange" />}
            selected={this.state.selectedTab == 'findTab'}
            onPress={this.handleFindTabPress}
            data-seed="logId1"
          />
          <TabBar.Item
            key="future"
            title="未来行情"
            icon={
              <div className="iconfont icon-ic_quotation icon-nav_icon_me">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selectedIcon={
              <div className="iconfont icon-ic_quotation bgChange icon-nav_icon_me">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selected={this.state.selectedTab == 'futureTab'}
            onPress={this.handleFutureTabPress}
          />
          <TabBar.Item
            key="rank"
            title="达人榜"
            icon={
              <div className="iconfont icon-ic_leaderboard">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selectedIcon={
              <div className="iconfont icon-ic_leaderboard bgChange">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selected={this.state.selectedTab == 'rankTab'}
            onPress={this.handleRankTabPress}
          />
          <TabBar.Item
            key="me"
            title="个人中心"
            icon={
              <div className="iconfont icon-ic_me">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selectedIcon={
              <div className="iconfont icon-ic_me bgChange">
                {newsCount > 0 ? <span className="tabsRed" /> : false}
              </div>
            }
            selected={this.state.selectedTab == 'meTab'}
            onPress={this.handleMineTabPress}
          />
        </TabBar>
      </div>
    );
  }
}

// @ts-ignore
export default withRouter(connect(mapStateToProps)(MyTabBar));
