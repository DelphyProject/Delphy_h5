import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import HeadTab from './component/topTab/index';
import MainBox from './component/mainBox/index';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import * as fetchTypes from '@/redux/actions/fetchTypes';
import './record.less';
import NotNetwork from '@/components/notNetwork';
import Loading from '@/components/loading';

interface MyRecordProps {
  serverData: any;
}
interface MyRecordState {
  data: Array<any>;
  isLoading: boolean;
}
type Props = MyRecordProps & DispatchProp;
let typeFlag = null;
let prams: any = {
  page: 1,
  per_page: 10,
};
class MyRecord extends React.Component<Props, MyRecordState> {
  child: any;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  // 下拉刷新
  upPull = pageNum => {
    prams.page = pageNum;
    this.props.dispatch(
      //@ts-ignore
      fetchData.myRecord(prams, () => {
        this.child.clearReload(false);
      }),
    );
  };

  componentWillUnmount() {
    this.props.dispatch({ type: fetchTypes.CLEANDATA });
  }

  // 点击头部tap
  tabClick = (title, index) => {
    if (typeFlag != index) {
      prams.page = 1;
      if (this.child) {
        this.child.clearPageNum(1);
      }
      this.setState({ isLoading: true });
      typeFlag = index;
      this.props.dispatch({ type: fetchTypes.CLEANDATA });
    } else {
      return;
    }
    if (index == 0) {
      prams = {
        page: 1,
        per_page: 10,
      };
    } else if (index == 1) {
      prams.transType = 1;
    } else if (index == 2) {
      prams.transType = 5;
    } else if (index == 3) {
      prams.transType = 4;
    } else if (index == 4) {
      prams.transType = 6;
    } else if (index == 5) {
      prams.transType = 0;
    } else if (index == 6) {
      prams.transType = 3;
    } else if (index == 7) {
      prams.transType = 21;
    } else if (index == 8) {
      prams.transType = 20;
    }
    this.props.dispatch(
      //@ts-ignore
      fetchData.myRecord(prams, result => {
        if (result.code != 90002) {
          this.setState({ isLoading: false });
        }
      }),
    );
  };

  componentDidMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.myRecord(prams, () => {
        this.setState({ isLoading: false });
      }),
    );
  }

  render() {
    return (
      <div className="my-record">
        <Helmet>
          <title>收支记录</title>
        </Helmet>
        {this.props.serverData.severError ? (
          <NotNetwork />
        ) : (
          <div>
            <HeadTab tabClick={this.tabClick} />
            {this.state.isLoading ? (
              <div className="is-loading">
                <Loading />
              </div>
            ) : (
              <MainBox
                isLoading={this.state.isLoading}
                data={this.props.serverData.data}
                upPull={this.upPull}
                ref={child => {
                  this.child = child;
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.myRecord,
});
export default connect(mapStateToProps)(MyRecord);
