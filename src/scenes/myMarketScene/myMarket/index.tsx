import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import ButtomTabs from '../../../components/framework/tabs';
import MyMarketConduct from './module/myMarketConduct';
import EscapeItem from './module/_escapeItem/escapeItem';
import MyMarketWait from './module/myMarketWait';
import MyMarketClear from './module/myMarketClear';
import MyMarketEnd from './module/myMarketEnd';
import Carousel from './_slider/_slider';
import { isLogin } from '../../../utils/tool';
import NotNetwork from '../../../components/notForecast';
import { shareMethod, redirect, reLoad } from '../../../utils/share';
import Loading from '../../../components/loading';
import './myMarket.less';
import { cancelRequest } from '@/utils/request';

let myMarketNav;
let myMarketNavBen;
let myMarketNavBenTop;
let myMarketPageScorll;

let myMarketScrollStateA = 1;
let myMarketScrollStateB = 1;
let myMarketScrollStateC = 1;
let myMarketScrollStateD = 1;
const perPage = 10;
let myMarketPageA = 1;
let myMarketPageB = 1;
let myMarketPageC = 1;
let myMarketPageD = 1;
interface MyMarketPageProps {
  mePageState: any;
  serverData: any;
}
interface MyMarketPageState {
  userId: any;
  myMarketStete: any;
  loadingA: boolean;
  loadingB: boolean;
  loadingC: boolean;
  loadingD: boolean;
  commentesA: any;
  commentesB: any;
  commentesC: any;
  commentesD: any;
  loadImg1: number;
  loadImg2: number;
  loadImg3: number;
  loadImg4: number;
  isEscape: boolean;
}
type Props = MyMarketPageProps & RouteComponentProps & DispatchProp;
class MyMarketPage extends React.Component<Props, MyMarketPageState> {
  changeType: string;
  constructor(props) {
    super(props);
    this.changeType = 'Forecast';
    this.state = {
      myMarketStete: 1,
      loadingA: false,
      loadingB: false,
      loadingC: false,
      loadingD: false,
      commentesA: '',
      commentesB: '',
      commentesC: '',
      commentesD: '',
      loadImg1: 0, // 0初始状态 1请求完成
      loadImg2: 0,
      loadImg3: 0,
      loadImg4: 0,
      userId: isLogin(false),
      isEscape: false,
    };
    redirect();
    const obj = {
      shareUrl: window.location.href,
      type: 1,
    };
    shareMethod(obj);
  }

  componentWillUnmount() {
    reLoad();
  }

  componentWillMount() {
    this.initData();
  }

  initData = () => {
    myMarketScrollStateA = 1;
    myMarketScrollStateB = 1;
    myMarketScrollStateC = 1;
    myMarketScrollStateD = 1;
    myMarketPageA = 1;
    myMarketPageB = 1;
    myMarketPageC = 1;
    myMarketPageD = 1;
    this.props.dispatch({
      type: 'assets_init_data',
    });
  };

  componentDidMount() {
    this.loadingData();
  }

  loadingData = () => {
    cancelRequest();
    this.props.dispatch({
      type: 'assets_init_data',
    });
    this.setState({
      commentesA: sessionStorage.getItem('commentesA'),
      commentesB: sessionStorage.getItem('commentesB'),
      commentesC: sessionStorage.getItem('commentesC'),
      commentesD: sessionStorage.getItem('commentesD'),
    });
    if (sessionStorage.getItem('myMarketStete')) {
      this.setState({
        myMarketStete: sessionStorage.getItem('myMarketStete'),
      });
    }
    if (this.state.userId) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMyProfile(null, { type: this.changeType }),
      );
    }
    if (this.state.userId) {
      const params1 = {
        page: 1,
        per_page: perPage,
        status: 1,
        type: this.changeType,
      };
      this.setState({
        loadingA: true,
        commentesA: '数据加载中...',
      });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchUserOngoingMarkets(params1, this.changeType, ret => {
          myMarketScrollStateA = 2;
          this.setState({
            loadImg1: 1,
          });
          if (ret.code == 200) {
            if (ret.data.length == perPage) {
              myMarketPageA++;
              myMarketScrollStateA = 1;
              this.setState({
                loadingA: false,
                commentesA: '上滑加载更多',
              });
              sessionStorage.setItem('commentesA', this.state.commentesA);
            } else if (ret.data.length == 0) {
              this.setState({
                loadingA: false,
                commentesA: '没有进行中的市场',
              });
              sessionStorage.setItem('commentesA', this.state.commentesA);
            } else {
              this.setState({
                loadingA: false,
                commentesA: '没有更多数据',
              });
              sessionStorage.setItem('commentesA', this.state.commentesA);
            }
          } else {
            this.setState({
              loadingA: false,
              commentesA: '数据加载错误',
            });
          }
        }),
      );
      if (this.changeType == 'Forecast') {
        const params2 = {
          page: 1,
          per_page: perPage,
          status: 2,
          type: this.changeType,
        };
        this.setState({
          loadingB: true,
          commentesB: '数据加载中...',
        });
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserWaitMarkets(params2, ret => {
            myMarketScrollStateB = 2;
            this.setState({
              loadImg2: 1,
            });
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketScrollStateB = 1;
                myMarketPageB++;
                this.setState({
                  loadingB: false,
                  commentesB: '上滑加载更多',
                });
                sessionStorage.setItem('commentesB', this.state.commentesB);
              } else if (ret.data.length == 0) {
                this.setState({
                  loadingB: false,
                  commentesB: '没有等待中的市场',
                });
                sessionStorage.setItem('commentesB', this.state.commentesB);
              } else {
                this.setState({
                  loadingB: false,
                  commentesB: '没有更多数据',
                });
                sessionStorage.setItem('commentesB', this.state.commentesB);
              }
            } else {
              this.setState({
                loadingB: false,
                commentesB: '数据加载错误',
              });
            }
          }),
        );
        const params3 = {
          page: 1,
          per_page: perPage,
          status: 3,
          type: this.changeType,
        };
        this.setState({
          loadingC: true,
          commentesC: '数据加载中...',
        });
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserClearMarkets(params3, ret => {
            this.setState({
              loadImg3: 1,
            });
            myMarketScrollStateC = 2;
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketScrollStateC = 1;
                myMarketPageC++;
                this.setState({
                  loadingC: false,
                  commentesC: '上滑加载更多',
                });
                sessionStorage.setItem('commentesC', this.state.commentesC);
              } else if (ret.data.length == 0) {
                this.setState({
                  loadingC: false,
                  commentesC: '没有清算中的市场',
                });
                sessionStorage.setItem('commentesC', this.state.commentesC);
              } else {
                this.setState({
                  loadingC: false,
                  commentesC: '没有更多数据',
                });
                sessionStorage.setItem('commentesC', this.state.commentesC);
              }
            } else {
              this.setState({
                loadingC: false,
                commentesC: '数据加载错误',
              });
            }
          }),
        );
      }
      const params4 = {
        page: 1,
        per_page: perPage,
        status: 4,
        type: this.changeType,
      };
      this.setState({
        loadingD: true,
        commentesD: '数据加载中...',
      });

      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchUserCompleteMarkets(params4, this.changeType, ret => {
          myMarketScrollStateD = 2;
          this.setState({
            loadImg4: 1,
          });
          if (ret.code == 200) {
            if (ret.data.length == perPage) {
              myMarketPageD++;
              myMarketScrollStateD = 1;
              this.setState({
                loadingD: false,
                commentesD: '上滑加载更多',
              });
              sessionStorage.setItem('commentesD', this.state.commentesD);
            } else if (ret.data.length == perPage) {
              this.setState({
                loadingD: false,
                commentesD: '没有已结束的市场',
              });
              sessionStorage.setItem('commentesD', this.state.commentesD);
            } else {
              this.setState({
                loadingD: false,
                commentesD: '没有更多数据',
              });
              sessionStorage.setItem('commentesD', this.state.commentesD);
            }
          } else {
            this.setState({
              loadingD: false,
              commentesD: '数据加载错误',
            });
          }
        }),
      );
    }
  };

  scrollMarket = () => {
    myMarketNav = document.getElementById('myMarketNav');
    myMarketNavBen = document.getElementById('myMarketNavBen');
    myMarketNavBenTop = myMarketNavBen.offsetTop;
    myMarketPageScorll = document.getElementById('myMarketPage');
    const scrollTop = myMarketPageScorll.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(myMarketPageScorll.clientHeight, myMarketPageScorll.clientHeight);
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(
      myMarketPageScorll.scrollHeight,
      myMarketPageScorll.scrollHeight,
    );
    // 控制tab的定位状态
    if (scrollTop >= myMarketNavBenTop) {
      myMarketNav.classList.add('myMarketNavFiexd');
    } else {
      myMarketNav.classList.remove('myMarketNavFiexd');
    }
    if (this.state.userId) {
      if (
        clientHeight + scrollTop >= getScrollHeight - 10 &&
        this.state.myMarketStete == 1 &&
        myMarketScrollStateA == 1
      ) {
        this.setState({
          loadingA: true,
          commentesA: '正在加载数据',
        });
        const params1 = {
          page: myMarketPageA,
          per_page: perPage,
          status: 1,
          type: this.changeType,
        };
        myMarketScrollStateA = 2;
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserOngoingMarkets(params1, this.changeType, ret => {
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketPageA++;
                myMarketScrollStateA = 1;
                this.setState({
                  loadingA: false,
                  commentesA: '上滑加载更多',
                });
                sessionStorage.setItem('commentesA', this.state.commentesA);
              } else {
                this.setState({
                  loadingA: false,
                  commentesA: '没有更多数据',
                });
                sessionStorage.setItem('commentesA', this.state.commentesA);
              }
            }
          }),
        );
      }
      if (
        clientHeight + scrollTop >= getScrollHeight - 10 &&
        this.state.myMarketStete == 2 &&
        myMarketScrollStateB == 1
      ) {
        this.setState({
          loadingB: true,
          commentesB: '正在加载数据',
        });

        const params2 = {
          page: myMarketPageB,
          per_page: perPage,
          status: 2,
          type: this.changeType,
        };
        myMarketScrollStateB = 2;
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserWaitMarkets(params2, ret => {
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketPageB++;
                myMarketScrollStateB = 1;
                this.setState({
                  loadingB: false,
                  commentesB: '上滑加载更多',
                });
                sessionStorage.setItem('commentesB', this.state.commentesB);
              } else {
                this.setState({
                  loadingB: false,
                  commentesB: '没有更多数据',
                });
                sessionStorage.setItem('commentesB', this.state.commentesB);
              }
            }
          }),
        );
      }
      if (
        clientHeight + scrollTop >= getScrollHeight - 10 &&
        this.state.myMarketStete == 3 &&
        myMarketScrollStateC == 1
      ) {
        this.setState({
          loadingC: true,
          commentesC: '正在加载数据',
        });
        const params3 = {
          page: myMarketPageC,
          per_page: perPage,
          status: 3,
          type: this.changeType,
        };
        myMarketScrollStateC = 2;
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserClearMarkets(params3, ret => {
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketPageC++;
                myMarketScrollStateC = 1;
                this.setState({
                  loadingC: false,
                  commentesC: '上滑加载更多',
                });
                sessionStorage.setItem('commentesC', this.state.commentesC);
              } else {
                this.setState({
                  loadingC: false,
                  commentesC: '没有更多数据',
                });
                sessionStorage.setItem('commentesC', this.state.commentesC);
              }
            }
          }),
        );
      }
      if (
        clientHeight + scrollTop >= getScrollHeight - 10 &&
        this.state.myMarketStete == 4 &&
        myMarketScrollStateD == 1
      ) {
        this.setState({
          loadingD: true,
          commentesD: '正在加载数据',
        });

        const params4 = {
          page: myMarketPageD,
          per_page: perPage,
          status: 4,
          type: this.changeType,
        };
        myMarketScrollStateD = 2;
        this.props.dispatch(
          //@ts-ignore
          fetchData.fetchUserCompleteMarkets(params4, this.changeType, ret => {
            if (ret.code == 200) {
              if (ret.data.length == perPage) {
                myMarketPageD++;
                myMarketScrollStateD = 1;
                this.setState({
                  loadingD: false,
                  commentesD: '上滑加载更多',
                });
                sessionStorage.setItem('commentesD', this.state.commentesD);
              } else {
                this.setState({
                  loadingD: false,
                  commentesD: '没有更多数据',
                });
                sessionStorage.setItem('commentesD', this.state.commentesD);
              }
            }
          }),
        );
      }
    }
  };

  // 切换至吃鸡活动类型
  changeToEscape = type => {
    this.initData();
    if (type == 2) {
      this.setState({ isEscape: true }, () => {
        this.changeType = 'Eat_chicken';
        this.loadingData();
        this.setState({ myMarketStete: 1 }, () => {
          sessionStorage.setItem('myMarketStete', '1');
        }); // 显示进行中的tab
      });
    } else {
      this.setState({ isEscape: false }, () => {
        this.changeType = 'Forecast';
        this.loadingData();
        this.setState({ myMarketStete: 1 }, () => {
          sessionStorage.setItem('myMarketStete', '1');
        }); // 显示进行中的tab
      });
    }
  };

  render() {
    const { userProfile } = this.props.mePageState;
    const {
      userClearMarkets,
      userWaitMarkets,
      userOngoingMarkets,
      userCompleteMarkets,
      escapeOngoingMarkets,
      escapeCompleteMarkets,
    } = this.props.serverData;
    const ongoingData = this.state.isEscape ? escapeOngoingMarkets : userOngoingMarkets;
    const completeData = this.state.isEscape ? escapeCompleteMarkets : userCompleteMarkets;
    const UnLoginView = () => (
      <div className="notLogMarket">
        <img src={require('../../../img/not_loging.png')} alt="" />
        <p>您还未登录</p>
        <pre
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            this.props.history.push('/login');
          }}>
          登录
        </pre>
      </div>
    );
    return (
      <div>
        <Helmet>
          <title>我的预测</title>
        </Helmet>
        <ButtomTabs />
        {this.state.userId ? (
          <div className="myMarketPage" id="myMarketPage" onScroll={this.scrollMarket}>
            <div className="myMarketHead">
              <Carousel userProfile={userProfile} changeToEscape={this.changeToEscape} />
            </div>
            <div className="myMarketNavBen" id="myMarketNavBen">
              <div className="myMarketNav" id="myMarketNav">
                <ul>
                  <li
                    className={this.state.myMarketStete == 1 ? 'current' : ''}
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.setState({ myMarketStete: 1 });
                      sessionStorage.setItem('myMarketStete', '1');
                    }}>
                    进行中
                    {this.state.myMarketStete == 1 ? <span /> : false}
                  </li>
                  {!this.state.isEscape ? (
                    <li
                      className={this.state.myMarketStete == 2 ? 'current' : ''}
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        this.setState({ myMarketStete: 2 });
                        sessionStorage.setItem('myMarketStete', '2');
                      }}>
                      等待结果
                      {this.state.myMarketStete == 2 ? <span /> : false}
                    </li>
                  ) : null}
                  {!this.state.isEscape ? (
                    <li
                      className={this.state.myMarketStete == 3 ? 'current' : ''}
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        this.setState({ myMarketStete: 3 });
                        sessionStorage.setItem('myMarketStete', '3');
                      }}>
                      清算中
                      {this.state.myMarketStete == 3 ? <span /> : false}
                    </li>
                  ) : null}
                  <li
                    className={this.state.myMarketStete == 4 ? 'current' : ''}
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.setState({ myMarketStete: 4 });
                      sessionStorage.setItem('myMarketStete', '4');
                    }}>
                    已结束
                    {this.state.myMarketStete == 4 ? <span /> : false}
                  </li>
                </ul>
              </div>
            </div>
            <div className="myMarket">
              {this.state.myMarketStete == 1 ? (
                <div className="myMarketConduct">
                  {this.state.loadImg1 == 1 ? (
                    ongoingData.length != 0 ? (
                      <div>
                        {ongoingData.map((item, key) => {
                          // <MyMarketConduct item={item} key={key} />
                          if (item.type != undefined && item.type != '' && item.type == 2) {
                            return <EscapeItem data={item} key={key} />;
                          }
                          return (
                            <MyMarketConduct
                              item={item}
                              win_shares={item.total_shares}
                              rewardRule={item.rewardRule}
                              key={key}
                            />
                          );
                        })}
                        <div
                          style={{
                            textAlign: 'center',
                            paddingBottom: `${0.15}rem`,
                            lineHeight: 2,
                          }}>
                          {this.state.loadingA ? (
                            <img
                              width="20"
                              style={{ marginRight: 10, position: 'relative', top: `${4}px` }}
                              src={require('../../../img/tail-spin.svg')}
                              alt=""
                            />
                          ) : (
                            false
                          )}
                          {this.state.commentesA}
                        </div>
                      </div>
                    ) : (
                      <NotNetwork title="您还没参与进行中的话题哦" titleTwo="快来参加吧" />
                    )
                  ) : (
                    <Loading />
                  )}
                </div>
              ) : (
                false
              )}

              {this.state.myMarketStete == 2 ? (
                <div className="myMarketWait">
                  {this.state.loadImg2 == 1 ? (
                    userWaitMarkets.length != 0 ? (
                      <div>
                        {userWaitMarkets.map((item, key) => (
                          <MyMarketWait
                            item={item}
                            key={key}
                            rewardRule={item.rewardRule}
                            win_shares={item.total_shares}
                          />
                        ))}
                        <div
                          style={{
                            textAlign: 'center',
                            paddingBottom: `${0.15}rem`,
                            lineHeight: 2,
                          }}>
                          {this.state.loadingB ? (
                            <img
                              width="20"
                              style={{ marginRight: 10, position: 'relative', top: `${4}px` }}
                              src={require('../../../img/tail-spin.svg')}
                              alt=""
                            />
                          ) : (
                            false
                          )}
                          {this.state.commentesB}
                        </div>
                      </div>
                    ) : (
                      <NotNetwork title="您还没有等待结果的话题哦" titleTwo="快来参加吧" />
                    )
                  ) : (
                    <Loading />
                  )}
                </div>
              ) : (
                false
              )}
              {this.state.myMarketStete == 3 ? (
                <div className="myMarketClear">
                  {this.state.loadImg3 == 1 ? (
                    userClearMarkets.length != 0 ? (
                      <div>
                        {userClearMarkets.map((item, key) => (
                          <MyMarketClear
                            item={item}
                            key={key}
                            rewardRule={item.rewardRule}
                            win_shares={item.total_shares}
                          />
                        ))}
                        <div
                          style={{
                            textAlign: 'center',
                            paddingBottom: `${0.15}rem`,
                            lineHeight: 2,
                          }}>
                          {this.state.loadingC ? (
                            <img
                              width="20"
                              style={{ marginRight: 10, position: 'relative', top: `${4}px` }}
                              src={require('../../../img/tail-spin.svg')}
                              alt=""
                            />
                          ) : (
                            false
                          )}
                          {this.state.commentesC}
                        </div>
                      </div>
                    ) : (
                      <NotNetwork title="您还没有清算中的话题哦" titleTwo="快来参加吧" />
                    )
                  ) : (
                    <Loading />
                  )}
                </div>
              ) : (
                false
              )}
              {this.state.myMarketStete == 4 ? (
                <div className="myMarketEnd">
                  {this.state.loadImg4 == 1 ? (
                    completeData.length != 0 ? (
                      <div>
                        {completeData.map((item, key) => {
                          if (item.type != undefined && item.type != '' && item.type == 2) {
                            return <EscapeItem data={item} key={key} />;
                          }
                          return (
                            <MyMarketEnd
                              item={item}
                              key={key}
                              win_shares={item.total_shares}
                              rewardRule={item.rewardRule}
                              dpyLocked={userProfile.dpyLocked}
                            />
                          );
                        })}
                        <div
                          style={{
                            textAlign: 'center',
                            paddingBottom: `${0.15}rem`,
                            lineHeight: 2,
                          }}>
                          {this.state.loadingD ? (
                            <img
                              width="20"
                              style={{ marginRight: 10, position: 'relative', top: `${4}px` }}
                              src={require('../../../img/tail-spin.svg')}
                              alt=""
                            />
                          ) : (
                            false
                          )}
                          {this.state.commentesD}
                        </div>
                      </div>
                    ) : (
                      <NotNetwork title="您还没有已结束的话题哦" titleTwo="快来参加吧" />
                    )
                  ) : (
                    <Loading />
                  )}
                </div>
              ) : (
                false
              )}
            </div>
          </div>
        ) : (
          <UnLoginView />
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.marketPageState,
  mePageState: store.mePageState,
});

export default connect(mapStateToProps)(withRouter(MyMarketPage));
