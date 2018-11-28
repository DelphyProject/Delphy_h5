import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import OracleCard from '../../../findScene/detailScene/components/_oracleCard/index';
import './detailTop.less';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import { formatTime } from '../../../../utils/time';
import { showToast } from '@/utils/common';
interface DetailTopProps {
  isCollect: boolean;
  data: any;
  loginAlert1: any;
  marketId: number;
  serverData: any;
}
interface DetailTopState {
  expand: boolean;
  loadingOracle: boolean;
  isCollect: boolean;
  isImtoken: boolean;
}
type Props = DetailTopProps & DispatchProp;

class DetailTop extends React.Component<Props, DetailTopState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      loadingOracle: false,
      isCollect: this.props.isCollect,
      isImtoken: !!window.imToken,
    };

    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  getOracle = () => {
    this.setState({
      loadingOracle: true,
    });
    this.props.dispatch(
      // @ts-ignore
      fetchData.fetchOracleInfo(this.props.marketId, () => {
        this.setState({
          loadingOracle: false,
        });
      }),
    );
  };

  changeExpand = () => {
    this.setState({
      expand: !this.state.expand,
    });
    // this.props.judgeHide()
  };

  componentWillMount() {
    const { oracleInfo, oracleMarketId } = this.props.serverData;

    if (oracleMarketId != this.props.marketId || oracleInfo == 0) {
      this.setState({
        loadingOracle: true,
      });
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchOracleInfo(this.props.marketId, ret => {
          if (ret.code == 200) {
            this.setState({
              loadingOracle: false,
            });
          }
        }),
      );
    }
  }

  collect = (e, marketId) => {
    if (this.props.loginAlert1()) {
      this.props.dispatch(
        // @ts-ignore
        fetchData.collect(marketId, result => {
          if (result.code == 200) {
            showToast('收藏成功', 2);
            this.setState({
              isCollect: true,
            });
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
    }
  };

  unCollect = (e, marketId) => {
    if (this.props.loginAlert1()) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.unCollect(marketId, result => {
          if (result.code == 200) {
            showToast('取消收藏', 2);
            this.setState({
              isCollect: false,
            });
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
    }
  };

  collectMethod = (e, marketID) => {
    if (this.state.isCollect) {
      this.unCollect(e, marketID);
    } else {
      this.collect(e, marketID);
    }
  };

  render() {
    const { marketDetailData, oracleInfo, oracleMarketId } = this.props.serverData;
    let imgBg;
    let imgBgPartner;
    if (this.props.data.image != undefined) {
      if (this.props.data.image.indexOf(',') == -1) {
        // Only one image
        imgBg = this.props.data.image;
        imgBgPartner = imgBg; // No choice. Only one image
      } else {
        // More than one image
        const images = this.props.data.image.split(',');
        imgBg = images[0];
        imgBgPartner = images[1];
      }
    }
    const marketId = this.props.marketId;
    return (
      <div className="escapeTopicBoxDetail">
        <div className="detailTop">
          {this.props.data != '' ? (
            <div>
              {
                <div className="topicItem">
                  <div className="itemTop item-top-bottom">
                    <div className="itemTopBox">
                      <img
                        className="topicBgImg"
                        src={this.state.isImtoken ? imgBg : imgBgPartner}
                      />

                      <div className="wraperBox">
                        <div className="topicImgMidTitle">{this.props.data.title}</div>
                        <div className="topicImgBom">
                          <div className="left">
                            <span>
                              截止：
                              {formatTime(this.props.data.endTime)}
                            </span>
                          </div>
                          <div className="right">
                            <i className="img2 iconfontMarket icon-ic_people" />
                            <span>{this.props.data.numInvestor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.expand ? (
                    <div className="hideArea">
                      <OracleCard
                        getOracle={this.getOracle}
                        loadingOracle={this.state.loadingOracle}
                        data={oracleMarketId == marketId ? oracleInfo : false}
                        // news="sflsfks"
                        type={marketDetailData.status}
                        marketType={0}
                      />
                      <div className="desText">{this.props.data.description}</div>
                    </div>
                  ) : (
                    false
                  )}
                  <div
                    className="loadMore"
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.changeExpand();
                    }}>
                    {this.state.expand ? (
                      <div className="content">
                        <span className="text1">收起</span>
                        {/* <img className="downImg" src={require('../../../../img/find/up.png')} /> */}
                        <span className="upArrow Open icon-Bxiangqingzhankaix iconfontMarket" />
                      </div>
                    ) : (
                      <div className="content">
                        <span className="text1">展开更多</span>
                        {/* <img className="downImg" src={require('../../../../img/find/down.png')} /> */}
                        <span className="downArrow Open icon-Bxiangqingzhankaix iconfontMarket" />
                      </div>
                    )}
                  </div>
                </div>
              }
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});

export default connect(mapStateToProps)(DetailTop);
