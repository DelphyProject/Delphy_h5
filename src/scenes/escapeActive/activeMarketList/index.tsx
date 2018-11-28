import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import './activeMarketList.less';
import { Helmet } from 'react-helmet';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { showToast } from '@/utils/common';
import MarketHead from '../components/marketHead/index';
import MarketMainBanner from '../components/marketMainBanner/index';
import ListItem from '../components/listItem/index';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import Login from '../../../components/loading/index';
import NotNetwork from '../../../components/notNetwork/index';
import MarketAlert from '../components/marketAlert/index';
interface ActiveMarketListProps {
  id: number;
  detailData: any;
}
interface ActiveMarketListState {
  isLoadingShow: boolean;
  isErrorShow: boolean;
  isAlertShow: boolean;
  height: number;
  currentPrizePool: any;
  numInvestor: any;
}

type Props = ActiveMarketListProps & DispatchProp & RouteComponentProps;
class ActiveMarketList extends React.Component<Props, ActiveMarketListState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingShow: false,
      isErrorShow: false,
      isAlertShow: false,
      height: 0,
      currentPrizePool: null,
      numInvestor: null,
    };
  }

  componentWillUnmount() {
    window.socket.removeListener(this.props.id);
  }

  componentWillMount() {
    window.socket.on(this.props.id, data => {
      // console.log(data);
      // console.log('-----2222');
      this.setState({ currentPrizePool: data.reward, numInvestor: data.numInvestor });
    });

    this.setState({
      height: window.innerHeight,
    });
    this.setState({ isLoadingShow: true });
    this.props.dispatch(
      ///@ts-ignore
      fetchData.getCurrentActiveDetail(this.props.id, res => {
        if (res.code != 200) {
          this.setState({ isErrorShow: true, isLoadingShow: false });
          showToast(res.msg, 3);
        }
      }),
    );
    this.props.dispatch(
      //@ts-ignore
      fetchData.getEscapeMarketListData(this.props.id, res => {
        if (res.code != 200) {
          this.setState({ isErrorShow: true, isLoadingShow: false });
          showToast(res.msg, 3);
        }
      }),
    );
  }

  componentWillReceiveProps(props) {
    if (!props.detailData.isLoadingA && !props.detailData.isLoadingB) {
      this.setState({ isLoadingShow: false });
      // 显示新市场出现的弹窗
      if (props.detailData.marketListData.length) {
        props.detailData.marketListData.forEach(item => {
          if (item.status == 100) {
            if (item.userStatus == 0 && !item.holdOptionId) {
              this.setState({ isAlertShow: true });
            } else {
              this.setState({ isAlertShow: false });
            }
          }
        });
      }
    }
  }

  // 页面跳转方法
  jumpPage = id => {
    this.props.history.push(`/escape/activeDetail/${id}`);
  };

  btnClick = pram => {
    this.setState({ isAlertShow: pram });
  };

  render() {
    return (
      <div className="active-market-list" style={{ minHeight: this.state.height }}>
        <Helmet>
          <title>吃鸡专场</title>
        </Helmet>
        {this.state.isAlertShow && <MarketAlert btnClick={this.btnClick} />}
        {this.state.isLoadingShow && (
          <div className="loading-mask">
            <Login />
          </div>
        )}
        {this.state.isErrorShow && (
          <div className="loading-mask">
            <NotNetwork />
          </div>
        )}
        <MarketHead
          currentPrizePool={this.state.currentPrizePool}
          numInvestor={this.state.numInvestor}
          data={this.props.detailData.currentData}
        />
        <MarketMainBanner data={this.props.detailData.marketListData} jumpPage={this.jumpPage} />
        <ListItem data={this.props.detailData.marketListData} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  detailData: store.escapeMarketList,
});

export default connect(mapStateToProps)(withRouter(ActiveMarketList));
