import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import Loading from '@/components/loading';
import NotForecast from '@/components/notForecast';
import NotNetwork from '@/components/notNetwork';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import Header from './_otherHeader';
import Topic from '@/components/_topic/_topic';
import './otherInfo.less';

interface OtherInfoProps {
  serverData: any;
  profileid: string;
}

interface OtherInfoState {
  tip: string;
  loading: boolean;
}

let otherScrollview;
let isFirstPull = 1;
let page = 1;
const perPage = 20;
type Props = OtherInfoProps & DispatchProp & RouteComponentProps;
class OtherProfile extends React.Component<Props, OtherInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      tip: '',
      loading: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchOtherInfo(this.props.profileid, null, null),
    );
    page = 1;
    this.props.dispatch({
      type: fetchTypes.CLEAR_OTHERINFO_MARKETS_DATA,
    });
    const params = {
      page,
      per_page: perPage,
      status: 1,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchOtherMarket(this.props.profileid, params, ret => {
        if (ret.code == 200) {
          if (ret.data && ret.data != '0') {
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
    otherScrollview = document.getElementById('_otherScrollview');
    const { scrollTop } = otherScrollview;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(otherScrollview.clientHeight, otherScrollview.clientHeight);
    // 获取文档完整的高度
    const getScrollHeight = Math.max(otherScrollview.scrollHeight, otherScrollview.scrollHeight);
    if (scrollTop + clientHeight >= getScrollHeight - 100 && isFirstPull == 1) {
      isFirstPull = 2;
      const params = {
        page,
        per_page: perPage,
        status: 1,
      };

      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchOtherMarket(this.props.profileid, params, ret => {
          if (ret.code == 200) {
            setTimeout(() => {
              isFirstPull = 1;
            }, 500);
            if (ret.data && ret.data.length != '0') {
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
    const {
      otherInfo,
      serverError,
      isFetchingOtherMarket,
      isFetchingOtherInfo,
      markets,
    } = this.props.serverData;
    let contentView;
    if (serverError) {
      contentView = <NotNetwork />;
    } else if (isFetchingOtherMarket && isFetchingOtherInfo) {
      contentView = <Loading />;
    } else {
      contentView = (
        <div onScroll={this.thisScroll} id="_otherScrollview">
          <div>
            <Header otherInfo={otherInfo} profileid={this.props.profileid} />
          </div>
          {markets.length == 0 ? (
            <div className="noMarket">
              <NotForecast title="未参与任何预测" titleTwo="" />
            </div>
          ) : (
            <div>
              <div className="next-guess1">
                — Ta有
                {markets.length}
                场参与预测进行中 —
              </div>
              <Topic data={markets} />

              <div
                style={{
                  textAlign: 'center',
                  lineHeight: 3,
                  color: 'rgb(136, 147, 164)',
                  position: 'relative',
                  top: -10,
                }}>
                {this.state.loading ? (
                  <img
                    width="20"
                    style={{ marginRight: 10, position: 'relative', top: 4 }}
                    src={require('@/img/tail-spin.svg')}
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

    return (
      <div className="otherInfo">
        <Helmet>
          <title>{otherInfo.name}</title>
        </Helmet>
        {contentView}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(OtherProfile);
