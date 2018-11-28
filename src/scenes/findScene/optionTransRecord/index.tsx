import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchType from '@/redux/actions/fetchTypes';
import RecordTop from '@/scenes/findScene/optionTransRecord/RecordTop';
import RecordItem from '@/scenes/findScene/optionTransRecord/recordItem';

import Loading from '@/components/loading';

let scrollView;
let isFirstPull = 1;
let page = 1;
const perPage = 20;
let isLoading = false;
interface TxRecordProps {
  serverData: any;
}
interface TxRecordState {
  loading: boolean;
  tip: string;
}
type Props = TxRecordProps & DispatchProp;
class TxRecordPage extends React.Component<Props, TxRecordState> {
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
    this.props.dispatch({
      type: fetchType.CLEAR_OPTION_RECORD_DATA,
    });
    const params = {
      page,
      per_page: perPage,
    };
    isLoading = true;
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchOptionTransRecord(this.props.optionId, params, ret => {
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
    scrollView = document.getElementById('_scrollView');
    const scrollTop = scrollView.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(scrollView.clientHeight, scrollView.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(scrollView.scrollHeight, scrollView.scrollHeight);

    if (scrollTop + clientHeight >= getScrollHeight - 100 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        page,
        per_page: perPage,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchOptionTransRecord(this.props.optionId, params, ret => {
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
    const option: any = sessionStorage.getItem('option');
    const optionData = JSON.parse(option);
    return (
      <div>
        <Helmet>
          <title>交易记录</title>
        </Helmet>
        {isLoading ? (
          <Loading />
        ) : (
          <div onScroll={this._scroll} id="_scrollView">
            <RecordTop data={optionData} />
            <div
              className="lineCrude"
              style={{
                height: `${0.1}rem`,
                width: `${100}%`,
                backgroundColor: '#e7e9ed',
              }}
            />
            {transRecord ? <RecordItem data={transRecord} /> : false}

            <div
              style={{
                textAlign: 'center',
                lineHeight: 3,
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
  serverData: store.optionTransactionRecordState,
});
export default connect(mapStateToProps)(TxRecordPage);
