import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Tabs, List } from 'antd-mobile';
import { showToast } from '@/utils/common';
import NotForecast from '@/components/notForecast';
import ThisTabs from '@/components/framework/tabs';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { isLogin } from '@/utils/tool';
// import { formatTime } from '@/utils/time';
import './rank.less';

interface RankProps {
  rankData: any;
}
interface RankState {
  periodCode: number;
  userId: any;
  illustration: boolean;
  isTotal: boolean;
  myRank: any;
  myRankImage: any;
  tabIndex: number;
}
type Props = RankProps & DispatchProp;
const Item = List.Item;
let rankListTopScroll;
let rankPage;

class Rank extends React.Component<Props, RankState> {
  tabs: { title: string }[];
  constructor(props) {
    super(props);
    this.state = {
      periodCode: 0,
      userId: isLogin(false) ? localStorage.getItem('userId') : -1,
      illustration: false,
      isTotal: false,
      myRank: '',
      myRankImage: '',
      tabIndex: 0,
    };
    this.tabs = [{ title: '本周' }, { title: '上周' }, { title: '累计' }];
  }

  componentWillMount() {
    this.getData(1);
  }

  getData = obj => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRank({ type: obj }, ret => {
        if (ret.code !== 200) {
          showToast(ret.msg, 2);
        } else {
          let rankimage;
          ret.data.forEach((item, index) => {
            if (item.num <= 3) {
              const imgUrl = require(`./../../img/rank/${item.num}.svg`);
              rankimage = <img src={imgUrl} alt="rank" />;
            } else {
              rankimage = item.num;
            }
            if (item.userId === this.state.userId) {
              this.setState({ myRank: item, myRankImage: rankimage });
            }
          });
        }
      }),
    );
  };
  setIllustration = key => e => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      illustration: key === 1 ? true : false,
    });
  };
  renderHeaderRank = key => {
    if (key === 1) {
      return (
        <div className="rankListTopScroll">
          <div className="rankListTop">
            <span className="title1">名次</span>
            <span className="title2">用户</span>
            <span className="title3">&nbsp;&nbsp;&nbsp;&nbsp; 获胜</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="rankListTopScroll">
          <div className="rankListTop">
            <span className="title1">名次</span>
            <div className="title2">
              <span className="title2left">用户</span>
              <span className="title2right">参与场次</span>
            </div>
            <span className="title3">准确率</span>
          </div>
        </div>
      );
    }
  };
  getTabsData = (tab, index) => {
    switch (index) {
      case 0:
        this.setState({
          isTotal: false,
          tabIndex: index,
        });
        this.getData(index + 1);
        break;
      case 1:
        this.setState({
          isTotal: false,
          tabIndex: index,
        });
        this.getData(index + 1);
        break;
      case 2:
        this.setState({
          isTotal: true,
          tabIndex: index,
        });
        this.getData(index + 1);
        break;
      default:
        this.setState({
          isTotal: false,
          tabIndex: 0,
        });
        this.getData(index + 1);
    }
  };
  setTabDetails = rankData1 => {
    let rankimage;
    let thisExtra;
    let rate;
    return rankData1.map((item, index) => {
      if (item.num <= 3) {
        const imgUrl = require(`./../../img/rank/${item.num}.svg`);
        rankimage = <img src={imgUrl} alt="rank" />;
      } else {
        rankimage = item.num;
      }
      rate = !!item.winRate ? `${parseFloat((item.winRate * 100).toPrecision(4))}%` : '0%';
      thisExtra = this.state.isTotal ? rate : item.winCount;
      return (
        <div id="itemRow" key={index}>
          <div className="rankimage">{rankimage}</div>
          <Item thumb={item.avatar} arrow="empty" extra={thisExtra}>
            {!this.state.isTotal ? (
              item.nickname
            ) : (
              <div className="nameAndcount">
                <span className="firstSpan">{item.nickname}</span>
                <span className="countRank">{item.countNum}</span>
              </div>
            )}
          </Item>
        </div>
      );
    });
  };
  rankScrll = () => {
    rankListTopScroll = document.getElementsByClassName('rankListTopScroll');
    rankPage = document.getElementsByClassName('am-tabs-pane-wrap-active');
    if (rankPage === null) return;
    if (!rankListTopScroll) return;
    const scrollTop = rankPage[1].scrollTop;
    if (scrollTop >= rankListTopScroll[this.state.tabIndex].offsetTop) {
      rankListTopScroll[this.state.tabIndex].classList.add('rankListTopScrollFixed');
    } else {
      rankListTopScroll[this.state.tabIndex].classList.remove('rankListTopScrollFixed');
    }
  };

  render() {
    const thisHeight = window.innerHeight - 50;
    const { list } = this.props.rankData;
    const rankData = !!list ? list : [];

    return (
      <div className="rank" id="rankPage" onScroll={this.rankScrll}>
        <Helmet>
          <title>排行榜</title>
        </Helmet>
        <ThisTabs />
        <div className="thisTabs" style={{ height: thisHeight }}>
          <Tabs
            tabs={this.tabs}
            initialPage={'t2'}
            animated={false}
            // tslint:disable-next-line:jsx-no-lambda
            onChange={(tab, index) => {
              this.getTabsData(tab, index);
            }}
            tabBarActiveTextColor="#FF6D1A"
            tabBarInactiveTextColor="#999"
            tabBarTextStyle={{
              fontFamily: 'PingFangSC-Medium',
              fontSize: '0.14rem',
              lineHeight: '0.20rem',
              fontWeight: 400,
              color: 'rgba(122,122,122,1)',
            }}
            tabBarUnderlineStyle={{
              height: '3px',
              border: 'none',
              borderRadius: '31% 31% 34% 34%',
              // backgroundColor: '#FF6D1A',
              background: 'linear-gradient(90deg,rgba(255,146,102,1) 0%,rgba(251,114,79,1) 100%)',
              padding: '0 0.2125rem',
              backgroundClip: 'content-box',
            }}>
            <div className="tabDetails" style={{ height: thisHeight - 220 }}>
              <img src={require('@/img/rank/banner.svg')} alt="预测达人榜" />
              <div id="rankList">
                <List renderHeader={this.renderHeaderRank(1)}>
                  {rankData.length > 0 ? (
                    this.setTabDetails(rankData)
                  ) : (
                    <NotForecast title="暂无数据！" titleTwo="" />
                  )}
                </List>
              </div>
            </div>

            <div className="tabDetails" style={{ height: thisHeight - 220 }}>
              <img src={require('@/img/rank/banner.svg')} alt="预测达人榜" />
              <div id="rankList">
                <List renderHeader={this.renderHeaderRank(1)}>
                  {rankData.length > 0 ? (
                    this.setTabDetails(rankData)
                  ) : (
                    <NotForecast title="暂无数据！" titleTwo="" />
                  )}
                </List>
              </div>
            </div>

            <div className="tabDetails" id="tabDetails3" style={{ height: thisHeight - 220 }}>
              <img src={require('@/img/rank/banner.svg')} alt="预测达人榜" />
              <div id="rankList">
                <List renderHeader={this.renderHeaderRank(3)}>
                  {rankData.length > 0 ? (
                    this.setTabDetails(rankData)
                  ) : (
                    <NotForecast title="暂无数据！" titleTwo="" />
                  )}
                </List>
              </div>
            </div>
          </Tabs>
          {!!this.state.myRank && (
            <div className="myRank">
              <div id="itemRow">
                <div className="rankimage">{this.state.myRankImage}</div>
                <Item
                  thumb={this.state.myRank.avatar}
                  arrow="empty"
                  extra={
                    this.state.isTotal
                      ? `${parseFloat((this.state.myRank.winRate * 100).toPrecision(4))}%`
                      : this.state.myRank.winCount
                  }>
                  {!this.state.isTotal ? (
                    this.state.myRank.nickname
                  ) : (
                    <div className="nameAndcount">
                      <span className="firstSpan">{this.state.myRank.nickname}</span>
                      <span className="countRank">{this.state.myRank.countNum}</span>
                    </div>
                  )}
                </Item>
              </div>
            </div>
          )}
        </div>
        <div className="thisIcon" onClick={this.setIllustration(1)} />

        <div className={this.state.illustration ? 'numberVerPages show' : 'numberVerPages hidden'}>
          <div
            className="numberVerCover"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={this.setIllustration(0)}
          />
          <div className="numberVerRank">
            <div className="thisTitle">
              <h3 className="thisH3">本周</h3>
              <p className="thisP">
                本榜单统计所有在本周内参与场次达到5场的用户的胜率并作出排名，参与市场以在本周内结算的为准。
                胜率相同的用户，参与场次多的排名靠前，相同胜率相同参与场次的用户排名相同。
                本周结束后，排名第一的用户可获得100DPY的奖励，排名第二、第三的用户可获得30DPY奖励，排名4-10的用户可获得10DPY的奖励。
              </p>
              <h3 className="thisH3">累积</h3>
              <p className="thisP">
                本榜单统计所有在累积胜利场次达到三场的用户的胜率并作出排名，参与市场以在本周内结算的为准。
                胜率相同的用户，参与场次多的排名靠前，相同胜率相同参与场次的用户排名相同。
              </p>
            </div>
            <div className="lineNotMar" />
            <pre
              // tslint:disable-next-line:jsx-no-lambda
              onClick={this.setIllustration(0)}>
              确定
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  rankData: store.rankState,
});

export default connect(mapStateToProps)(withRouter(Rank));
