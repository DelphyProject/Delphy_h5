import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import * as fetchType from '../../../redux/actions/fetchTypes';
import RecordItem from '../../../components/recordItem/indexNew';
import NotForecast from '../../../components/notForecast';
import Loading from '../../../components/loading';

let _scrollView;
let isFirstPull = 1;
let page = 1;
const perPage = 30;
let isLoading = false;

class transactionRecord extends React.Component {
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
    this.props.dispatch({
      type: fetchType.CLEAR_BALANCE_RECORD_DATA,
    });
    const params = {
      page,
      per_page: perPage,
    };
    isLoading = true;
    this.props.dispatch(
      fetchData.fethcBalancePage(params, ret => {
        isLoading = false;
        if (ret.code == 200) {
          if (ret.data && ret.data != 0) {
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
            page++;
          } else {
            this.setState({
              tip: '',
              loading: false,
            });
          }
        } else {
          this.setState({
            loading: false,
          });
        }
      }),
    );
  }

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
        fetchData.fethcBalancePage(params, ret => {
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
        tip: '一大波记录正在袭来...',
      });
    }
  };

  render() {
    const { balancePageData } = this.props.serverData;
    // let balance=balancePageData.reverse()
    return (
      <div>
        <Helmet>
          <title>收支记录</title>
        </Helmet>

        {isLoading ? (
          <Loading />
        ) : (
          <div onScroll={this._scroll} id="_scrollView">
            {balancePageData.length != 0 ? (
              <div>
                <RecordItem data={balancePageData} />
                <div
                  style={{
                    textAlign: 'center',
                    lineHeight: 2,
                    color: 'rgb(136, 147, 164)',
                    position: 'relative',
                    top: 0,
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
            ) : (
              <NotForecast title="暂时没有交易记录" />
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.balanceState,
});

export default connect(mapStateToProps)(transactionRecord);
