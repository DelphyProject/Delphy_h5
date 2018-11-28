import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../redux/actions/fetchTypes';
import Loading from '../../../components/loading';
import NotNetwork from '../../../components/notNetwork';
import NotForecast from '../../../components/notForecast';
import Topic from '../../../components/_topic/_topic';
import './collection.less';

interface FavoritePageProps {
  serverData: any;
}
interface FavoritePageState {
  tip: string;
  loading: boolean;
}
type Props = FavoritePageProps & DispatchProp;

let thisScrollView;
let isFirstPull = 1;
let page = 1;
let perPage = 10;
class FavoritePage extends React.Component<Props, FavoritePageState> {
  constructor(props) {
    super(props);
    this.state = {
      tip: '上滑加载更多',
      loading: false,
    };
  }

  componentDidMount() {
    page = 1;
    perPage = 10;
    this.props.dispatch({
      type: fetchTypes.INIT_MYCOLLECTION,
    });
    const params = {
      page,
      per_page: perPage,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMyCollect(params, ret => {
        if (ret.code == 200) {
          if (ret.data && ret.data != 0) {
            page++;
            if (ret.data.length == perPage) {
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
            } else {
              this.setState({
                tip: '',
                loading: false,
              });
            }
          } else {
            this.setState({
              tip: '',
              loading: false,
            });
          }
        }
      }),
    );
  }

  thisScroll = () => {
    // 获取元素的隐藏区域
    thisScrollView = document.getElementById('_scrollView');
    const { scrollTop } = thisScrollView;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(thisScrollView.clientHeight, thisScrollView.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(thisScrollView.scrollHeight, thisScrollView.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 10 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        page,
        per_page: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchMyCollect(params, ret => {
          if (ret.code == 200) {
            setTimeout(() => {
              isFirstPull = 1;
            }, 500);
            if (ret.data && ret.data.length != 0) {
              this.setState({
                tip: '上滑加载更多',
                loading: false,
              });
              page++;
            } else {
              this.setState({
                tip: '没有更多数据了',
                loading: false,
              });
            }
          } else {
            this.setState({
              tip: '上滑加载更多',
              loading: false,
            });
            showToast(ret.msg, 2);
          }
        }),
      );
      this.setState({
        loading: true,
        tip: '一大波预测正在袭来...',
      });

      // 数据存储
      // return false;
    }
  };

  render() {
    const { isLoading, serverError, marketList } = this.props.serverData;
    let myCollectMarkets;
    // var arr = []

    if (marketList.length > 0) {
      myCollectMarkets = (
        <div>
          <Topic data={marketList} />
          <div
            style={{
              textAlign: 'center',
              lineHeight: 2,
              color: 'rgb(136, 147, 164)',
              position: 'relative',
              top: -15,
            }}>
            {this.state.loading ? (
              <img
                width="20"
                style={{ marginRight: 10, position: 'relative', top: 4 }}
                src={require('../../../img/tail-spin.svg')}
                alt=""
              />
            ) : (
              false
            )}
            {this.state.tip}
          </div>
        </div>
      );
    } else {
      myCollectMarkets = (
        <div className="noMarket">
          <NotForecast title="暂无收藏" titleTwo="" />
        </div>
      );
    }

    let contentView;
    if (serverError) {
      contentView = <NotNetwork />;
    } else if (isLoading) {
      contentView = <Loading />;
    } else {
      contentView = (
        <div className="favoritePage" onScroll={this.thisScroll} id="_scrollView">
          {myCollectMarkets}
        </div>
      );
    }

    return (
      <div>
        <Helmet>
          <title>我的收藏</title>
        </Helmet>
        {contentView}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.myCollectState,
});

export default connect(mapStateToProps)(FavoritePage);
