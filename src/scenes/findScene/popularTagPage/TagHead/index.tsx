import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import TagDescribe from '@/scenes/findScene/popularTagPage/TagHead/tagDescribe';
import Mycard from '@/components/marketCard';

import * as fetchType from '@/redux/actions/fetchTypes';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import Loading from '@/components/loading';
import NotForecast from '@/components/notForecast';
import './TagHead.less';

// tslint:disable-next-line:variable-name
let _scrollView;
let isFirstPull = 1;
let page = 1;
let perPage = 10;
let isLoading = false;
interface TagHeadProps {
  serverData: any;
}
interface TagHeadState {
  loading: boolean;
  tip: string;
}
type Props = TagHeadProps & DispatchProp;
class TagHead extends React.Component<Props, TagHeadState> {
  constructor(props) {
    super(props);
    this.state = {
      tip: '上滑加载更多',
      loading: false,
    };
  }

  componentDidMount() {
    isFirstPull = 1;
    page = 1;
    perPage = 10;
    isLoading = false;
    this.props.dispatch({
      type: fetchType.CLEAR_MARKET_IN_TAG_DATA,
    });

    const params = {
      page,
      per_page: perPage,
    };

    isLoading = true;
    if (page == 1) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchPopularMarketsInTags(this.props.tagId, params, ret => {
          isLoading = false;
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
  }

  // tslint:disable-next-line:variable-name
  _scroll = () => {
    // 获取元素的隐藏区域
    _scrollView = document.getElementById('_scrollView');
    const scrollTop = _scrollView.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(_scrollView.clientHeight, _scrollView.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(_scrollView.scrollHeight, _scrollView.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 100 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        page,
        per_page: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchPopularMarketsInTags(this.props.tagId, params, ret => {
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
          }
        }),
      );
      this.setState({
        loading: true,
        tip: '一大波预测正在袭来...',
      });
    }
  };

  render() {
    const { markets } = this.props.serverData;
    let showPopularMarkets = (
      <div>
        {markets.map((dataitem, key) => (
          <div key={key}>
            <Mycard data={dataitem} showStyle="MARKET_POPULAR" />
          </div>
        ))}
        <div
          style={{
            textAlign: 'center',
            lineHeight: 2,
            color: 'rgb(136, 147, 164)',
            position: 'relative',
            top: -20,
          }}>
          {this.state.loading ? (
            <img
              width="20"
              style={{ marginRight: 10, position: 'relative', top: 4 }}
              src={require('../../../../img/tail-spin.svg')}
              alt=""
            />
          ) : (
            this.state.tip
          )}
        </div>
      </div>
    );
    if (markets.length == 0) {
      showPopularMarkets = <NotForecast title="当前没有市场" titleTwo="" />;
    }
    const sTag: any = sessionStorage.getItem('tags');
    const tags = JSON.parse(sTag);
    return isLoading ? (
      <Loading />
    ) : (
      <div className="tegPack" onScroll={this._scroll} id="_scrollView">
        <div className="teg">
          <div className="tagTitlePage">
            <img src={tags.image} alt="" />
            <h4>{tags.title}</h4>
          </div>

          <TagDescribe TagDescribe={tags.description} />
          <p className="TagNumber">
            该标签下共有
            {tags.totalMarkets}
            个预测进行中
          </p>
        </div>
        <div className="tegPackContent">{showPopularMarkets}</div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketsInTagState,
});

export default connect(mapStateToProps)(TagHead);
