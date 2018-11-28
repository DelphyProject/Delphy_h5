import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchType from '@/redux/actions/fetchTypes';
import RecordTop from '@/scenes/findScene/optionTransRecord/RecordTop';
import RecordItem from '@/scenes/findScene/optionTransRecord/recordItem';
import Loading from '@/components/loading';

// tslint:disable-next-line:variable-name
let _scrollView;
let isFirstPull = 1;
let page = 1;
let perPage = 10;
let isLoading = false;
interface MarketTxRecordProps {
  serverData: any;
}
interface MarketTxRecordState {
  loading: boolean;
  tip: string;
}
type Props = MarketTxRecordProps & DispatchProp;
class MarketTxRecordPage extends React.Component<Props, MarketTxRecordState> {
  constructor(props) {
    super(props);
    this.state = {
      tip: '上滑加载更多',
      loading: false,
    };
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    isFirstPull = 1;
    page = 1;
    perPage = 10;
    isLoading = false;
    this.props.dispatch({
      type: fetchType.CLEAR_MARKET_RECORD_DATA,
    });

    const params = {
      page,
      per_page: perPage,
    };
    isLoading = true;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchMarketTransRecord(this.props.marketId, params, ret => {
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
        fetchData.fetchMarketTransRecord(this.props.marketId, params, ret => {
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
    const { transRecord } = this.props.serverData;
    const mDetail: any = sessionStorage.getItem('marketDetail');
    const marketDetail = JSON.parse(mDetail);
    return (
      <div>
        <Helmet>
          <title>交易记录</title>
        </Helmet>
        {isLoading ? (
          <Loading />
        ) : (
          <div onScroll={this._scroll} id="_scrollView">
            <RecordTop data={marketDetail} />
            {transRecord ? <RecordItem data={transRecord} /> : false}
            <div
              style={{
                textAlign: 'center',
                lineHeight: 2,
                color: 'rgb(136, 147, 164)',
                position: 'relative',
              }}>
              {this.state.loading ? (
                <img
                  width="20"
                  style={{ marginRight: 10, position: 'relative', top: 4 }}
                  src={require('../../../img/tail-spin.svg')}
                  alt=""
                />
              ) : (
                this.state.tip
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketTransactionRecordState,
});
export default connect(mapStateToProps)(MarketTxRecordPage);
