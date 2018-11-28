import React from 'react';
import { Helmet } from 'react-helmet';
import { PullToRefresh } from 'antd-mobile';
import ReactDOM from 'react-dom';
import './unlockProgress.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import UnlockProgressItem from './_unlockProgressItem/_unlockProgressItem';
import NotForecast from '../../../../components/notForecast';
import NotNetwork from '../../../../components/notNetwork';
import Loading from '../../../../components/loading';
interface UnlockProgressProps {
  serverData: any;
}
interface UnlockProgressState {
  refreshing: boolean;
  height: number;
  isLoading: boolean;
}
type Props = UnlockProgressProps & DispatchProp;

class UnlockProgress extends React.Component<Props, UnlockProgressState> {
  ptr: any;
  constructor(props) {
    super(props);
    const doc = document.documentElement as HTMLElement;
    this.state = {
      refreshing: false,
      height: doc.clientHeight,
      isLoading: true,
    };
  }

  componentWillMount() {
    // page = 1
    // pageSize = 20
    this.props.dispatch({
      type: fetchTypes.INIT_UNLOCKPROGRESS,
    });
    // let params = {
    //     page: page,
    //     per_page: pageSize
    // }
    this.setState({
      isLoading: true,
    });
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchUnlockProgress(result => {
        this.setState({
          isLoading: false,
        });
        if (result.code == 200) {
          if (result.data.length > 0) {
            // page++
          }
        }
      }),
    );
  }

  componentDidMount() {
    // eslint-disable-next-line
    const node = ReactDOM.findDOMNode(this.ptr);
    if (!node) return;
    const reactDom = ReactDOM.findDOMNode(this.ptr) as HTMLElement;
    // eslint-disable-next-line
    const hei = this.state.height - reactDom.offsetTop;
    setTimeout(() => {
      this.setState({ height: hei });
    }, 0);
  }

  genData() {
    // let params = {
    //     page: page,
    //     per_page: pageSize
    // }
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchUnlockProgress(result => {
        if (result.code == 200) {
          if (result.data.length > 0) {
            // page++
          }
        }
      }),
    );
  }

  render() {
    const { progressList, serverError } = this.props.serverData;
    let indexItem;

    // progressList.map((val, index) => {
    //     if (val.dpy !=undefined&&val.dpy!=0) {
    //         indexItem = index
    //         break
    //     }
    // })
    for (let i = 0; i < progressList.length; i++) {
      if (progressList[i].dpy != undefined && progressList[i].dpy != 0) {
        indexItem = i;
        break;
      }
    }
    return (
      <div className="unlockProgress">
        <Helmet>
          <title>解锁详情</title>
        </Helmet>
        {serverError ? (
          <NotNetwork />
        ) : this.state.isLoading ? (
          <Loading />
        ) : progressList.length == 0 && !this.state.isLoading ? (
          <NotForecast title="暂无数据" titleTwo="" />
        ) : (
          <div>
            <div className="unlockTitle">
              <p>剩余解锁时间</p>
              <p>解锁金额 (DPY)</p>
            </div>
            <PullToRefresh
              damping={60}
              ref={el => {
                this.ptr = el;
              }}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
              indicator={{ deactivate: '下拉刷新' }}
              direction="down"
              refreshing={this.state.refreshing}
              // tslint:disable-next-line:jsx-no-lambda
              onRefresh={() => {
                this.setState({ refreshing: true });
                setTimeout(() => {
                  this.setState({ refreshing: false });
                }, 1000);
              }}>
              <div className="unlockOutBox">
                {progressList.map((val, i) => (
                  <UnlockProgressItem key={i} isFirst={i == indexItem} data={val} />
                ))}
              </div>
            </PullToRefresh>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.unlockProgress,
});
export default connect(mapStateToProps)(UnlockProgress);
