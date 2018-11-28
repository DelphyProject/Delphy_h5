import React from 'react';
import { Tabs } from 'antd-mobile';
import './headTab.less';

let currentTab;
interface HeadTabProps {
  tabClick: any;
}
class HeadTab extends React.Component<HeadTabProps> {
  clickTab = (obj, index) => {
    this.props.tabClick(obj.title, index);
    currentTab = index;
    // this.setState({
    //   currentTab:index
    // })
  };

  render() {
    const tabs = [
      { title: '全部' },
      { title: '购买' },
      { title: '返还' },
      { title: '奖励' },
      { title: '锁定' },
      { title: '充值' },
      { title: '提现' },
      { title: '转入' },
      { title: '转出' },
    ];
    return (
      <div className="my-record-top">
        <Tabs
          tabs={tabs}
          tabBarActiveTextColor="#FF6D1A"
          page={currentTab}
          tabBarInactiveTextColor="#999"
          tabBarTextStyle={{
            fontFamily: 'PingFangSC-Medium',
            fontSize: '0.15rem',
            lineHeight: '0.45rem',
          }}
          tabBarUnderlineStyle={{
            height: '0.02rem',
            border: 'none',
            backgroundColor: '#FF6D1A',
            padding: '0 0.18rem',
            backgroundClip: 'content-box',
          }}
          // tslint:disable-next-line:jsx-no-lambda
          renderTabBar={props => (
            <Tabs.DefaultTabBar {...props} page={5} onTabClick={this.clickTab} />
          )}
        />
      </div>
    );
  }
}

export default HeadTab;
