import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import StableCoin from './stableCoinMarket';
import HotCoinMarket from './hotCoinMarket';
import NewCoinMarket from './newCoinMarket';
import Loading from '@/components/loading';
import NotForecast from '@/components/notForecast';
import './index.less';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';

interface FutureMarketProps {
  futureData: any;
}
interface FutureMarketState {
  currentTab: number;
  loadingStable: boolean;
  loadingHot: boolean;
  loadingNew: boolean;
}
type Props = FutureMarketProps & DispatchProp;
let pageHot;
let pageNew;
const size = 10;
class FutureMarket extends Component<Props, FutureMarketState> {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      loadingStable: true,
      loadingHot: true,
      loadingNew: true,
    };
  }
  componentWillMount() {
    pageHot = 1;
    pageNew = 1;
    this.props.dispatch({
      type: fetchTypes.INIT_FUTURE_DATA,
    });
  }
  componentDidMount() {
    //
    this.getStableList();
    this.getHotList();
    this.getNewList();
  }
  getStableList = () => {
    this.setState({
      loadingStable: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.getStableCoinList(() => {
        this.setState({
          loadingStable: false,
        });
      }),
    );
  };
  getHotList = () => {
    const params = {
      page: pageHot,
      per_page: size,
      marketTypeTag: 3,
    };
    this.setState({
      loadingHot: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.getHotCoinList(params, result => {
        this.setState({
          loadingHot: false,
        });
        if (result.data.length > 0) {
          pageHot++;
        }
      }),
    );
  };
  updateHotPage = () => {
    pageHot++;
  };
  getNewList = () => {
    const params = {
      page: pageNew,
      per_page: size,
      marketTypeTag: 4,
    };
    this.setState({
      loadingNew: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.getNewCoinList(params, result => {
        this.setState({
          loadingNew: false,
        });
        if (result.data.length > 0) {
          pageNew++;
        }
      }),
    );
  };
  updateNewPage = () => {
    pageNew++;
  };
  changetTab(tab) {
    this.setState({
      currentTab: tab,
    });
  }
  render() {
    const { stableList, hotList, newList } = this.props.futureData;
    let content;
    switch (this.state.currentTab) {
      case 0:
        content = !this.state.loadingStable ? (
          stableList.length === 0 ? (
            <NotForecast title="暂无数据" titleTwo="" />
          ) : (
            <StableCoin upPull={this.getStableList} />
          )
        ) : (
          <Loading />
        );
        break;
      case 1:
        // content = <HotCoinMarket upPull={this.getStableList} />;
        content = !this.state.loadingHot ? (
          hotList.length === 0 ? (
            <NotForecast title="暂无数据" titleTwo="" />
          ) : (
            <HotCoinMarket
              upPull={this.getHotList}
              updateHotPage={this.updateHotPage}
              page={pageHot}
            />
          )
        ) : (
          <Loading />
        );
        break;
      case 2:
        // content = <NewCoinMarket upPull={this.getStableList} />;
        content = !this.state.loadingNew ? (
          newList.length === 0 ? (
            <NotForecast title="暂无数据" titleTwo="" />
          ) : (
            <NewCoinMarket
              upPull={this.getNewList}
              updateNewPage={this.updateNewPage}
              page={pageNew}
            />
          )
        ) : (
          <Loading />
        );
        break;
      default:
        content = null;
        break;
    }
    return (
      <div className="fuMarketPage">
        <div className="futureTab">
          <div
            className={this.state.currentTab == 0 ? 'current tabNormal' : 'tabNormal'}
            onClick={this.changetTab.bind(this, 0)}>
            稳定币
            {this.state.currentTab == 0 ? <span /> : null}
          </div>
          <div
            className={this.state.currentTab == 1 ? 'current tabNormal' : 'tabNormal'}
            onClick={this.changetTab.bind(this, 1)}>
            热币搜索
            {this.state.currentTab == 1 ? <span /> : null}
          </div>
          <div className="tabRight">
            <div
              className={this.state.currentTab == 2 ? 'current tabSpecial' : 'tabSpecial'}
              onClick={this.changetTab.bind(this, 2)}>
              新币早知道
              {this.state.currentTab == 2 ? <span /> : null}
            </div>
            <i className="iconfont icon-hot newCoin" />
          </div>
        </div>
        {content}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  rankData: store.rankState,
  futureData: store.futureMarket,
});

export default connect(mapStateToProps)(withRouter(FutureMarket));
