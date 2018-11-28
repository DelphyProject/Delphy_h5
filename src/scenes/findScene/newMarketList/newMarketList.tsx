import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import Topic from '@/components/_topic/_topic';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import NotForecast from '@/components/notForecast';
import NotNetwork from '@/components/notNetwork';
import Loading from '@/components/loading';
import { shareMethod, redirect, reLoad } from '@/utils/share';
import './newMarketList.less';

let PageB = 1;
const perPage = 10;
let newMarketScrollState = 1;
let newListScroll;
let topNum5;
let topNum5Bool;
redirect();
interface NewMarketListProps {
  id: number;
  serverData: any;
}
interface NewMarketListState {
  comNewList: any;
  loading: boolean;
}
type Props = NewMarketListProps & DispatchProp;
class NewMarketList extends React.Component<Props, NewMarketListState> {
  constructor(props) {
    super(props);
    this.state = {
      comNewList: '',
      loading: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchSpecialInfo({ tid: this.props.id }),
    );
    PageB = 1;
    newMarketScrollState = 1;
    this.props.dispatch({
      type: fetchTypes.CLEAR_NEW_MARKET_LIST_DATA,
    });
    const obj = {
      shareUrl: window.location.href,
      type: 2,
      id: this.props.id,
    };
    shareMethod(obj);
    this.fetchFirstMarket();
  }

  componentWillUnmount() {
    reLoad();
  }

  componentDidMount() {
    this.setState({
      comNewList: localStorage.getItem('comNewList'),
    });
    newListScroll = document.getElementById('newMarketList');
  }

  fetchFirstMarket = () => {
    const params = {
      page: PageB,
      per_page: perPage,
      order: 'desc',
      sortby: 'time',
    };
    this.setState({
      comNewList: '正在加载中...',
      loading: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchFreshMarkets(params, ret => {
        if (ret.code == 200) {
          PageB++;
          if (ret.data.length == perPage) {
            this.setState({
              comNewList: '上滑加载更多',
              loading: false,
            });
            localStorage.setItem('comNewList', this.state.comNewList);
          } else if (ret.data.length < perPage) {
            this.setState({
              comNewList: '没有更多数据',
              loading: false,
            });
            localStorage.setItem('comNewList', this.state.comNewList);
          }
        } else {
          this.setState({
            comNewList: '数据加载错误',
            loading: false,
          });
        }
      }),
    );
  };

  saveScrollBool = () => {
    sessionStorage.setItem('topNum5Bool', '1');
  };

  scrollToMethod5 = () => {
    topNum5 = sessionStorage.getItem('topNum5');
    newListScroll.scrollTo && newListScroll.scrollTo(0, topNum5);
    newListScroll.scrollTop = topNum5;
  };

  newListScrollMethod = () => {
    newListScroll = document.getElementById('newMarketList');
    const scrollTopNewlist = newListScroll.scrollTop;
    sessionStorage.setItem('topNum5', scrollTopNewlist);
    // 获取当前元素的可视区域
    const clientHeightNewList = Math.max(newListScroll.clientHeight, newListScroll.clientHeight);
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeightNewList = Math.max(newListScroll.scrollHeight, newListScroll.scrollHeight);
    if (
      clientHeightNewList + scrollTopNewlist >= getScrollHeightNewList - 10 &&
      newMarketScrollState == 1
    ) {
      newMarketScrollState = 2;
      this.setState({
        comNewList: '正在加载中...',
        loading: true,
      });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchFreshMarkets(
          {
            page: PageB,
            per_page: perPage,
            order: 'desc',
            sortby: 'time',
          },
          ret => {
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                newMarketScrollState = 1;
                PageB++;
                this.setState({
                  comNewList: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('comNewList', this.state.comNewList);
              } else {
                this.setState({
                  comNewList: '没有更多数据',
                  loading: false,
                });
                localStorage.setItem('comNewList', this.state.comNewList);
              }
            }
          },
        ),
      );
    }
  };

  render() {
    const { dataFreshMarkets, serverError, specialInfo, isLoading } = this.props.serverData;
    const openingNum = specialInfo.openingNum;
    const openImg = specialInfo.img;
    const topics = serverError ? (
      <NotNetwork />
    ) : isLoading ? (
      <Loading />
    ) : dataFreshMarkets.length == 0 ? (
      <div className="noMarket">
        {' '}
        <NotForecast title="暂无预测话题！" titleTwo="" />
      </div>
    ) : (
      <div>
        <div className="runingTitle">
          — 正有
          {openingNum}
          场预测正在运行 —
        </div>
        <div>
          <Topic
            data={dataFreshMarkets}
            saveScrollBool={this.saveScrollBool}
            dispatch={this.props.dispatch}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            paddingBottom: `${0.15}rem`,
            lineHeight: 2,
          }}>
          {this.state.loading ? (
            <img
              width="20"
              style={{ marginRight: 10, position: 'relative', top: `${4}px` }}
              src={require('../../../img/tail-spin.svg')}
              alt=""
            />
          ) : (
            false
          )}
          {this.state.comNewList}
        </div>
      </div>
    );
    if (dataFreshMarkets != '' && specialInfo.openingNum != undefined) {
      topNum5Bool = sessionStorage.getItem('topNum5Bool');
      if (topNum5Bool == 1) {
        this.scrollToMethod5();
      }
    }
    return (
      <div className="newMarketList" id="newMarketList" onScroll={this.newListScrollMethod}>
        <Helmet>
          <title>今日最新预测</title>
        </Helmet>
        <div className="NewMarket">
          <div className="topImgBox">
            <img className="topImg" src={`${openImg}?imageView2/1/w/375/h/170`} />
          </div>
          {topics}
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.newMarketListState,
});

export default connect(mapStateToProps)(NewMarketList);
