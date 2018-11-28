import React from 'react';
import { DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { SegmentedControl } from 'antd-mobile';
import MyTabs from '@/components/framework/tabs';
import FutureMarket from '../futureMarket';
import HistoryMarket from '../historyMarket';
import './index.less';
interface FutureProps {
  tabClick: any;
}
interface FutureState {
  currentTab: number;
}
type Props = FutureProps & DispatchProp;
class Future extends React.Component<Props, FutureState> {
  ptr: any;

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
    };
  }
  changeSegment = e => {
    this.setState({
      currentTab: e.nativeEvent.selectedSegmentIndex,
    });
  };
  changetTab(tab) {
    this.setState({
      currentTab: tab,
    });
  }
  render() {
    return (
      <div className="futurePage">
        <Helmet>
          <title>未来行情</title>
        </Helmet>
        <div className="futureTitle">
          <div className="futureSegment">
            <SegmentedControl
              values={['未来行情', '历史记录']}
              tintColor={'#666'}
              style={{ height: '30px', width: '216px' }}
              onChange={this.changeSegment}
            />
          </div>
        </div>
        {this.state.currentTab === 0 ? (
          <FutureMarket />
        ) : (
          <HistoryMarket comeFrom="historyMarket" />
        )}
        <MyTabs />
      </div>
    );
  }
}

export default Future;
