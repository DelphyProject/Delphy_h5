import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Checkbox } from 'antd-mobile';
import Search from '@/scenes/findScene/findPageNew/_search/_search';
import SelectCard from '@/scenes/findScene/findPageNew/_selectCard/_selectCard';
import Slider from '@/components/_slider/_slider';
import Topic from '@/components/_topic/_topic';
import ButtomTabs from '@/components/framework/tabs';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './index.less';
import NotForecast from '@/components/notForecast';
import NotNetwork from '@/components/notNetwork';
import Loading from '@/components/loading';
import TipAlert from '@/scenes/findScene/findPageNew/tipAlert/tipAlert';
import { isLogin } from '@/utils/tool';
import { shareMethod, redirect, reLoad } from '@/utils/share';
import NewAlert from '@/scenes/findScene/findPageNew/newAlert';
import { RouteComponentProps } from 'react-router-dom';
import { getNowTimestamp } from '@/utils/time';
import { showToast } from '@/utils/common';
const CheckboxItem = Checkbox.CheckboxItem;

let topNum1Bool;

let findPage = 1;
let findPage1 = 1; //只赢不输
let findPage4 = 1; //赢者全拿
const perPage = 10;
let findPageScorll;
let topicItemTitle;
let showTopicTitle;

let findScrollState = 1; //全部 判断是否可以再滑动
let findScrollState1 = 1; //只赢不输
let findScrollState4 = 1; //赢者全拿
interface FindProps {
  serverData: any;
  showDownLoadBanner: any;
  newsCount: number;
}
interface FindState {
  commentesFind: any;
  commentesFind1: any;
  commentesFind4: any;
  isCollect: boolean;
  loading: boolean;
  isPhoneGap: boolean;
  isShowTipAlert: boolean;
  isShowShare: boolean;
  isNewShow: boolean;
  marketType: number;
  thisTopicItemData: any;
  noShowNewPlay: boolean;
  showTheNewPlayInstr: boolean;
  channelId: any;
  fetchType: number;
}
type Props = FindProps & DispatchProp & RouteComponentProps;
class Find extends React.Component<Props, FindState> {
  constructor(props) {
    super(props);
    this.state = {
      isCollect: false,
      commentesFind: '',
      commentesFind1: '',
      commentesFind4: '',
      loading: false,
      isPhoneGap: !!parent.isPhoneGap,
      isShowTipAlert: false,
      isShowShare: true,
      isNewShow: false,
      marketType: 0,
      thisTopicItemData: null,
      noShowNewPlay: false,
      showTheNewPlayInstr: false,
      channelId: '',
      fetchType: 0, //0 代表全部，1 只赢不输， 4 赢者全拿
    };
    redirect();
    const obj = {
      shareUrl: window.location.href,
      type: 1,
    };
    shareMethod(obj);
  }

  componentDidUpdate() {
    this.scrollToMethod();
  }

  componentWillUnmount() {
    reLoad();
  }

  componentDidMount() {
    // //@ts-ignore
    // window.getRouterLength = () => {
    //   return this.props.history.length
    // };
    findPageScorll = document.getElementById('findPageNew');
    topicItemTitle = document.getElementById('topicItemTitle');
    showTopicTitle = document.getElementById('showTopicTitle');
    this.setState({
      commentesFind: localStorage.getItem('commentesFind'),
      commentesFind1: localStorage.getItem('commentesFind1'),
      commentesFind4: localStorage.getItem('commentesFind4'),
    });
    this.scrollToMethod();
    window.onbeforeunload = () => {
      sessionStorage.setItem('topNum1Bool', '0');
    };
    this.setTheNewIstr();
  }

  componentWillMount() {
    this.fetchMarketFindNew();
    const cid = sessionStorage.getItem('channelId');
    const params = {
      val1: 0,
      val2: cid,
    };
    if (cid != undefined && cid != '') {
      this.setState({
        channelId: cid,
      });
    }
    if (localStorage.getItem('isShowTip') == null) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.showTip(params, ret => {
          if (ret.code == 200) {
            if (sessionStorage.getItem('isNewUserShow')) {
              this.setState({
                isNewShow: true,
              });
              sessionStorage.setItem('isNewUserShow', '');
            }
            if (ret.data.isShow == 1 && isLogin(false) == false) {
              localStorage.setItem('isShowTip', ret.data.isShow);
              this.setState({
                isShowTipAlert: true,
              });
            } else {
              this.setState({
                isShowTipAlert: false,
              });
            }
          }
        }),
      );
    }
  }

  fetchMarketFindNew = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchCarousel(),
    );
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchPopularTags(),
    );
    this.getHotMarkets(0);
    this.getHotMarkets(1);
    this.getHotMarkets(4);
  };
  getHotMarkets = (marketType: number) => {
    let scrollState;
    if (marketType == 0) {
      scrollState = findScrollState;
    } else if (marketType == 1) {
      scrollState = findScrollState1;
    } else if (marketType == 4) {
      scrollState = findScrollState4;
    }
    if (scrollState == 1) {
      if (marketType == 0) {
        this.setState({
          commentesFind: '正在加载中...',
          loading: true,
        });
      } else if (marketType == 1) {
        this.setState({
          commentesFind1: '正在加载中...',
          loading: true,
        });
      } else if (marketType == 4) {
        this.setState({
          commentesFind4: '正在加载中...',
          loading: true,
        });
      }
      const params = {
        type: marketType,
        page: 1,
        per_page: perPage,
        order: 'desc',
        sortby: 'investor',
      };

      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchPopularMarkets(params, marketType, ret => {
          if (ret.code == 200) {
            if (ret.data.length == perPage) {
              if (marketType == 0) {
                findPage++;
                this.setState({
                  commentesFind: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind', this.state.commentesFind);
              } else if (marketType == 1) {
                findPage1++;
                this.setState({
                  commentesFind1: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind1', this.state.commentesFind1);
              } else if (marketType == 4) {
                findPage4++;
                this.setState({
                  commentesFind4: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind4', this.state.commentesFind4);
              }
            } else if (ret.data.length < perPage) {
              if (marketType == 0) {
                findScrollState = 2;
                this.setState({
                  commentesFind: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind', this.state.commentesFind);
              } else if (marketType == 1) {
                findScrollState1 = 2;
                this.setState({
                  commentesFind1: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind1', this.state.commentesFind1);
              } else if (marketType == 4) {
                findScrollState4 = 2;
                this.setState({
                  commentesFind4: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind4', this.state.commentesFind4);
              }
            }
          } else {
            if (marketType == 0) {
              findScrollState = 2;
              this.setState({
                commentesFind: '数据加载错误',
                loading: false,
              });
            } else if (marketType == 1) {
              findScrollState1 = 2;
              this.setState({
                commentesFind1: '数据加载错误',
                loading: false,
              });
            } else if (marketType == 4) {
              findScrollState4 = 2;
              this.setState({
                commentesFind4: '数据加载错误',
                loading: false,
              });
            }
          }
        }),
      );
    }
  };

  scrollToMethod = () => {
    topNum1Bool = sessionStorage.getItem('topNum1Bool');
    const cScrollVal: any = sessionStorage.getItem('currentScrollVal');
    const currentScrollVal = parseInt(cScrollVal, 10) || 0;
    if (topNum1Bool == 1) {
      findPageScorll.scrollTo && findPageScorll.scrollTo(0, currentScrollVal);
      findPageScorll.scrollTop = currentScrollVal;
    }
  };

  findScroll = () => {
    findPageScorll = document.getElementById('findPageNew');
    topicItemTitle = document.getElementById('topicItemTitle');
    showTopicTitle = document.getElementById('showTopicTitle');
    const scrollTop = findPageScorll.scrollTop;
    sessionStorage.setItem('topNum1', scrollTop);
    // 获取当前元素的可视区域
    const clientHeight = Math.max(findPageScorll.clientHeight, findPageScorll.clientHeight);
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(findPageScorll.scrollHeight, findPageScorll.scrollHeight);
    let scrollState;
    if (this.state.marketType == 0) {
      scrollState = findScrollState;
    } else if (this.state.marketType == 1) {
      scrollState = findScrollState1;
    } else if (this.state.marketType == 4) {
      scrollState = findScrollState4;
    }
    if (clientHeight + scrollTop >= getScrollHeight - 10 && scrollState == 1) {
      let pa;
      if (this.state.marketType == 0) {
        pa = findPage;
      } else if (this.state.marketType == 1) {
        pa = findPage1;
      } else if (this.state.marketType == 4) {
        pa = findPage4;
      }
      const params = {
        type: this.state.marketType,
        page: pa,
        per_page: perPage,
        order: 'desc',
        sortby: 'investor',
      };
      if (this.state.marketType == 0) {
        findScrollState = 2;
        this.setState({
          commentesFind: '正在加载中...',
          loading: true,
        });
      } else if (this.state.marketType == 1) {
        findScrollState1 = 2;
        this.setState({
          commentesFind1: '正在加载中...',
          loading: true,
        });
      } else if (this.state.marketType == 4) {
        findScrollState4 = 2;
        this.setState({
          commentesFind4: '正在加载中...',
          loading: true,
        });
      }
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchPopularMarkets(params, this.state.marketType, ret => {
          if (ret.code == 200) {
            if (ret.data.length == perPage) {
              if (this.state.marketType == 0) {
                findScrollState = 1;
                findPage++;
                this.setState({
                  commentesFind: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind', this.state.commentesFind);
              } else if (this.state.marketType == 1) {
                findScrollState1 = 1;
                findPage1++;
                this.setState({
                  commentesFind1: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind1', this.state.commentesFind1);
              } else if (this.state.marketType == 4) {
                findScrollState4 = 1;
                findPage4++;
                this.setState({
                  commentesFind4: '上滑加载更多',
                  loading: false,
                });
                localStorage.setItem('commentesFind4', this.state.commentesFind4);
              }
            } else {
              if (this.state.marketType == 0) {
                this.setState({
                  commentesFind: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind', this.state.commentesFind);
              } else if (this.state.marketType == 1) {
                this.setState({
                  commentesFind1: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind1', this.state.commentesFind1);
              } else if (this.state.marketType == 4) {
                this.setState({
                  commentesFind4: '到底了，今天就这些了…',
                  loading: false,
                });
                localStorage.setItem('commentesFind4', this.state.commentesFind4);
              }
            }
          }
        }),
      );
    }
    if (showTopicTitle != null) {
      // 话题tab固定
      if (scrollTop >= showTopicTitle.offsetTop) {
        topicItemTitle.classList.add('topicItemTitleFiexd');
      } else {
        topicItemTitle.classList.remove('topicItemTitleFiexd');
      }
    }
  };

  saveScrollBool = () => {
    sessionStorage.setItem('topNum1Bool', '1');
  };

  toSpecialMarket = id => {
    if (id == 4) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.getPreviewInfo(result => {
          if (result.code == 200) {
            if (result.data.status == 2) {
              this.props.history.push(`escape/escapePreview`);
            } else {
              if (result.data.firstMarketEndTime > result.data.currTime) {
                this.props.history.push(`/escape/activity/${result.data.activityId}`);
              } else {
                this.props.history.push(`/escape/activeMarketList/${result.data.activityId}`);
              }
            }
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
      // this.props.history.push(`escape/escapePreview`);
      return;
    }
    sessionStorage.setItem('topNum1Bool', '0');
    sessionStorage.setItem('topNum2Bool', '0');
    sessionStorage.setItem('topNum4Bool', '0');
    this.props.history.push(`find/specialDetail/${id}`);
  };

  toNewMarketList = id => {
    sessionStorage.setItem('topNum5Bool', '0');
    this.props.history.push(`find/newMarketList/${id}`);
  };

  hideMethod = () => {
    this.setState({
      isShowTipAlert: false,
    });
  };

  tipToLogin = () => {
    this.props.history.push('/login');
    sessionStorage.setItem('isLoginStatus', '2');
  };

  toTeachPage = () => {
    this.props.history.push('/find/teachPage');
  };

  isNewClick = () => {
    this.setState({ isNewShow: false });
  };

  setTheNewIstr = () => {
    // const nowDate = new Date().getTime();
    const nowDate: any = getNowTimestamp();
    const newPlayWayInstroductTime: any = localStorage.getItem('newPlayWayInstroductTime');
    const getNewTime = (nowDate - newPlayWayInstroductTime) / 1000 / 60 / 60 / 24;
    // localStorage.setItem('newPlayWayInstroduct', 1);
    if (!localStorage.getItem('newPlayWayIntroductFirstShow')) {
      this.setState({
        showTheNewPlayInstr: true,
      });
    } else if (localStorage.getItem('newPlayWayIntroductFirstShow') && getNewTime >= 1) {
      const newPlayWayIntroductFirstShow: any = localStorage.getItem(
        'newPlayWayIntroductFirstShow',
      );
      const showDataCount = (nowDate - newPlayWayIntroductFirstShow) / 1000 / 60 / 60 / 24;
      if (
        localStorage.getItem('newPlayWayIntroductFirstShow') != 'neverShow' &&
        showDataCount <= 7
      ) {
        localStorage.setItem('newPlayWayInstroductTime', nowDate);
        this.setState({
          showTheNewPlayInstr: true,
        });
      }
    }
  };

  noShowNewPlay = e => {
    const value = e.target.checked;
    this.setState({
      noShowNewPlay: value,
    });
  };

  closeShow = () => {
    if (this.state.noShowNewPlay) {
      localStorage.setItem('newPlayWayIntroductFirstShow', 'neverShow');
    }
    if (!localStorage.getItem('newPlayWayIntroductFirstShow')) {
      const nowTime: any = getNowTimestamp();
      localStorage.setItem('newPlayWayIntroductFirstShow', nowTime);
    }
    this.setState({
      showTheNewPlayInstr: false,
    });
  };

  render() {
    const {
      isError,
      dataPopularMarkets,
      dataPopularWinAndNoLoseMarkets,
      dataPopularWinnerTakeAllMarkets,
      dataCarousel,
      dataPopularTags,
      isLoading,
    } = this.props.serverData;
    const { downLoadObj } = this.props.showDownLoadBanner;
    let topDownLoadView;
    if (downLoadObj.list != undefined) {
      let isShowBool = false;
      downLoadObj.list.forEach(val => {
        if (val.code == this.state.channelId) {
          isShowBool = true;
        }
      });
      topDownLoadView =
        !window.iosPlatform && !window.delphy ? (
          isShowBool ? (
            <a
              className="downloadLink"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.props.history.push(`/download?c=${this.state.channelId}`);
              }}>
              <img className="imgDown" src={require('../../../img/find/bannerDowoload.png')} />
            </a>
          ) : (
            ''
          )
        ) : (
          ''
        );
    }
    let tip;
    let data;
    if (this.state.marketType === 0) {
      tip = this.state.commentesFind;
      data = dataPopularMarkets;
    } else if (this.state.marketType === 1) {
      tip = this.state.commentesFind1;
      data = dataPopularWinAndNoLoseMarkets;
    } else if (this.state.marketType === 4) {
      tip = this.state.commentesFind4;
      data = dataPopularWinnerTakeAllMarkets;
    } else {
      tip = 'cbnvbnvnvnbvn';
      data = [];
    }
    let topics;
    if (dataPopularMarkets.length == 0) {
      topics = (
        <div className="noMarket">
          {' '}
          <NotForecast title="暂无话题" titleTwo="" />
        </div>
      );
    } else {
      topics = (
        <div>
          <SelectCard
            toNewMarketList={this.toNewMarketList}
            toSpecialMarket={this.toSpecialMarket}
            data={dataPopularTags}
          />
          <div id="showTopicTitle">
            <div className="topicItemTitle" id="topicItemTitle">
              <ul>
                <li
                  className={this.state.marketType == 0 ? 'current' : ''}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({ marketType: 0 });
                  }}>
                  全部
                  {this.state.marketType == 0 ? <span /> : false}
                </li>
                <li
                  className={this.state.marketType == 1 ? 'current' : ''}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({ marketType: 1 });
                  }}>
                  只赢不输
                  {this.state.marketType == 1 ? <span /> : false}
                </li>
                <li
                  className={this.state.marketType == 4 ? 'current' : ''}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({ marketType: 4 });
                  }}>
                  赢者全拿
                  {this.state.marketType == 4 ? <span /> : false}
                </li>
              </ul>
            </div>
          </div>
          {data.length > 0 ? (
            <div>
              <Topic
                saveScrollBool={this.saveScrollBool}
                typeId="find"
                data={data}
                dispatch={this.props.dispatch}
              />
              <div
                style={{
                  textAlign: 'center',
                  paddingBottom: `${0.15}rem`,
                  lineHeight: 2,
                  zIndex: 100,
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
                {tip}
              </div>
            </div>
          ) : (
            <div className="noMarket">
              {' '}
              <NotForecast title="暂无话题" titleTwo="" />
            </div>
          )}
        </div>
      );
    }
    const rewrad: string | null = sessionStorage.getItem('rewardAmount');

    return (
      <div>
        <div className="findPageNew" id="findPageNew" onScroll={this.findScroll}>
          <Helmet>
            <title>发现</title>
          </Helmet>
          {this.state.isShowTipAlert ? (
            <TipAlert
              hideMethod={this.hideMethod}
              tipToLogin={this.tipToLogin}
              toTeachPage={this.toTeachPage}
            />
          ) : (
            false
          )}
          {this.state.isNewShow ? (
            <NewAlert isNewClick={this.isNewClick} reward={rewrad || ''} />
          ) : null}
          <div style={{ display: 'none' }}>
            <img
              src="https://image.delphy.org.cn/464106449283317760?imageView2/1/w/400/h/400"
              alt=""
            />
          </div>
          {isError ? (
            <NotNetwork />
          ) : isLoading ? (
            <Loading />
          ) : (
            <div className="topics">
              {topDownLoadView}
              <Search newsCount={this.props.newsCount} />
              <Slider data={dataCarousel} imgStyle="sliderImg1" />
              {topics}
            </div>
          )}
        </div>
        <ButtomTabs />
        {!sessionStorage.getItem('isClose') && (
          <div className="find-invite">
            <img
              src={require('./../../../img/find/share-img.png')}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={e => {
                e.stopPropagation();
                this.props.history.push('/me/myinvite');
              }}
            />
            <div
              className="close-icon"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={e => {
                e.stopPropagation();
                // 关闭设置标记
                sessionStorage.setItem('isClose', 'true');
                this.setState({ isShowShare: false });
              }}
            />
          </div>
        )}
        {this.state.showTheNewPlayInstr ? (
          <div className="numberVerPage">
            <div className="numberVerCover" />
            <div className="numberVer">
              <div className="newPlayVer">
                <div className="imgDiv">
                  <img
                    className="thisImg"
                    src={require('./../../../img/newPlayWay.png')}
                    alt="新玩法"
                  />
                </div>
                <h4>新玩法上线</h4>
                <p className="newPlayInstr">天算推出了更刺激，收益更高的新玩法“赢者全拿”。</p>
                <p className="newPlayInstr">
                  用户所有的投入将变为奖池的一部分，赢者将均分全部奖池。
                </p>
                <p className="newPlayInstr">你可以在发现页或者专题下查看对应玩法的市场。</p>
                <div className="lineNotMar thislineNotMar" />
                <div className="newPlayBottom">
                  {/* <input id="thisCheckbox" type="checkbox" onChange={this.noShowNewPlay} /> */}
                  <CheckboxItem key="1" onChange={this.noShowNewPlay} />
                  <span className="newPlayLabel">下次不再提示</span>
                  <div className="notShowButton" onClick={this.closeShow}>
                    确定
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.findPageState,
  newsCount: store.news.newsCount,
  showDownLoadBanner: store.showDownLoadBanner,
});
export default connect(mapStateToProps)(Find);
