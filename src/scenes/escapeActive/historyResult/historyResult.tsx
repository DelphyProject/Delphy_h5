import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import './historyResult.less';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../redux/actions/fetchTypes';
import EscapeItem from '../../myMarketScene/myMarket/module/_escapeItem/escapeItem';
import Loading from '../../../components/loading';
import NotNetwork from '../../../components/notNetwork';
import NotForecast from '../../../components/notForecast';

interface HistoryReusltProps {
  escapeHistory: any;
}

interface State {
  tip: string;
  isLoading: boolean;
  loading: boolean;
}

type Props = HistoryReusltProps & DispatchProp & RouteComponentProps;

// tslint:disable-next-line:variable-name
let _scrollView;
let isFirstPull = 1;
let page = 1;
let perPage = 5;
class HistoryReuslt extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      tip: '上滑加载更多',
      isLoading: false,
      loading: false,
    };
  }

  componentWillMount() {
    page = 1;
    perPage = 5;
    this.props.dispatch({
      type: fetchTypes.INIT_ESCAPEHISTORY,
    });

    const params = {
      page,
      per_page: perPage,
    };
    this.setState({
      isLoading: true,
    });
    this.props.dispatch(
      // @ts-ignore
      fetchData.getEscapeHistory(params, ret => {
        this.setState({
          isLoading: false,
        });
        if (ret.code == 200) {
          if (ret.data && ret.data) {
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
  private _scroll = () => {
    // 获取元素的隐藏区域
    _scrollView = document.getElementById('_scrollView');
    const scrollTop = _scrollView.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(_scrollView.clientHeight, _scrollView.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(_scrollView.scrollHeight, _scrollView.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 10 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        page,
        per_page: perPage,
      };
      this.props.dispatch(
        // @ts-ignore
        fetchData.getEscapeHistory(params, ret => {
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
    }
  };

  render() {
    const { historyResult, serverError } = this.props.escapeHistory;

    let contentView;

    if (serverError) {
      contentView = <NotNetwork />;
    } else if (this.state.isLoading) {
      contentView = <Loading />;
    } else if (historyResult.length == 0) {
      contentView = <NotForecast title="您未参与吃鸡活动" titleTwo="" />;
    } else {
      contentView = (
        <div className="historyItems" onScroll={this._scroll} id="_scrollView">
          {historyResult.map((val, index) => (
            <EscapeItem key={val + index} data={val} />
          ))}
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
    }

    return (
      <div className="historyResult">
        <Helmet>
          <title>历史战绩</title>
        </Helmet>
        {contentView}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  escapeHistory: store.escapteHistory,
});

export default connect(mapStateToProps)(HistoryReuslt);
