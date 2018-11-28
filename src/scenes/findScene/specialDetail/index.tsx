import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import Topic from '@/components/_topic/_topic';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import NotForecast from '@/components/notForecast';
import NotNetwork from '@/components/notNetwork';
import Loading from '@/components/loading';
import { shareMethod, reLoad, redirect } from '@/utils/share';
import './specialDetail.less';

const perPage = 20;
const pecialDetailState = 1;
let page;
let specialDetailPageScorll;
let specialDetailScrollState = 1;
let topNum2;
let topNum4;
let idNum;
// let openingNum
redirect();
interface SpecialDetailProps {
  serverData: any;
  id: number;
}
interface SpecialDetailState {
  isImtoken: boolean;
  isLoadingPage: boolean;
  commentes: string;
  loading: boolean;
}
type Props = SpecialDetailProps & DispatchProp;
class SpecialDetail extends React.Component<Props, SpecialDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingPage: false,
      commentes: '正在加载中',
      loading: false,
      isImtoken: !!window.imToken,
    };

    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  componentWillUnmount() {
    reLoad();
  }

  componentWillMount() {
    this.props.dispatch({
      type: fetchTypes.CLEAR_MARKET_IN_TAG_DATA,
    });
    idNum = this.props.id;
    page = 1;
    const specialMarketId = this.props.id;
    const obj = {
      shareUrl: window.location.href,
      type: 2,
      id: this.props.id,
    };
    shareMethod(obj);

    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchSpecialInfo({ tid: specialMarketId }),
    );
    if (pecialDetailState == 1) {
      this.setState({
        isLoadingPage: true,
      });
      this.fetchMarket(specialMarketId);
    }
  }

  fetchMarket(id) {
    const params = {
      page: 1,
      per_page: perPage,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchPopularMarketsInTags(id, params, ret => {
        if (ret.code == 200) {
          this.setState({
            isLoadingPage: false,
          });
          if (ret.data.length == perPage) {
            page = 2;
            this.setState({
              commentes: '上滑加载更多',
              loading: false,
            });
          } else {
            specialDetailScrollState = 2;
            this.setState({
              commentes: '没有更多数据',
              loading: false,
            });
          }
        } else {
          this.setState({
            isLoadingPage: false,
          });
        }
      }),
    );
  }

  scrollToMethod2 = () => {
    topNum2 = sessionStorage.getItem('topNum2');
    specialDetailPageScorll.scrollTo && specialDetailPageScorll.scrollTo(0, topNum2);
    specialDetailPageScorll.scrollTop = topNum2;
  };

  scrollToMethod4 = () => {
    specialDetailPageScorll.scrollTo && specialDetailPageScorll.scrollTo(0, topNum4);
    topNum4 = sessionStorage.getItem('topNum4');
    specialDetailPageScorll.scrollTop = topNum4;
  };

  saveScrollBool = () => {
    if (idNum == 1) {
      sessionStorage.setItem('topNum2Bool', '1');
    }
    if (idNum == 2) {
      sessionStorage.setItem('topNum4Bool', '1');
    }
  };

  componentDidMount() {
    specialDetailPageScorll = document.getElementById('specialDetailPage');
  }

  scrollDetail = () => {
    specialDetailPageScorll = document.getElementById('specialDetailPage');
    const scrollTop = specialDetailPageScorll.scrollTop;
    if (idNum == 1) {
      sessionStorage.setItem('topNum2', scrollTop);
    }
    if (idNum == 2) {
      sessionStorage.setItem('topNum4', scrollTop);
    }
    // 获取当前元素的可视区域
    const clientHeight = Math.max(
      specialDetailPageScorll.clientHeight,
      specialDetailPageScorll.clientHeight,
    );
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(
      specialDetailPageScorll.scrollHeight,
      specialDetailPageScorll.scrollHeight,
    );

    if (clientHeight + scrollTop >= getScrollHeight - 10 && specialDetailScrollState == 1) {
      this.setState({
        commentes: '正在加载中',
        loading: true,
      });
      specialDetailScrollState = 2;
      const specialMarketId = sessionStorage.getItem('specialMarketId');
      const params = {
        page,
        per_page: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchPopularMarketsInTags(specialMarketId, params, ret => {
          if (ret.code == 200) {
            if (ret.data.length == perPage) {
              page++;
              specialDetailScrollState = 1;
              this.setState({
                commentes: '上滑加载更多',
                loading: false,
              });
            } else {
              this.setState({
                commentes: '没有跟多数据',
                loading: false,
              });
            }
          }
        }),
      );
    }
  };

  render() {
    const { markets, serverError, specialInfo } = this.props.serverData;
    const openingNum = specialInfo.openingNum;
    let openImg;

    if (this.state.isImtoken) {
      // Only shows original images
      openImg = specialInfo.img;
    } else {
      // Shows partner images (if available)
      openImg = specialInfo.partnerImg ? specialInfo.partnerImg : specialInfo.img;
    }

    let topics;
    if (markets.length == 0) {
      topics = (
        <div className="noMarket">
          {' '}
          <NotForecast title="暂无预测话题！" titleTwo="" />
        </div>
      );
    } else {
      topics = (
        <div>
          <div className="runingTitle">
            — 正有
            {openingNum}
            场预测正在运行 —
          </div>
          <div>
            <Topic
              data={markets}
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
            {this.state.commentes}
          </div>
        </div>
      );
    }
    const sTopNum4Bool: any = sessionStorage.getItem('topNum2Bool');
    if (specialInfo.openingNum != undefined && markets != '') {
      if (idNum == 1 && sTopNum4Bool == 1) {
        this.scrollToMethod2();
      }
      if (idNum == 21 && sTopNum4Bool == 1) {
        this.scrollToMethod4();
      }
    }
    return (
      <div className="specialDetail" id="specialDetailPage" onScroll={this.scrollDetail}>
        <Helmet>
          <title>专题</title>
        </Helmet>

        {serverError ? (
          <NotNetwork />
        ) : this.state.isLoadingPage ? (
          <Loading />
        ) : (
          <div className="MarketInTag">
            <div className="topImgBox">
              <img className="topImg" src={`${openImg}?imageView2/1/w/375/h/170`} />
            </div>
            {topics}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.marketsInTagState,
});

export default connect(mapStateToProps)(SpecialDetail);
