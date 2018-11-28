import React from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh } from 'antd-mobile';
import MainCell from '@/components/recordItem/indexNew';
import './main-box.less';
import NotForecast from '@/components/notForecast';

interface MainBoxProps {
  upPull: Function;
  data: any;
  isLoading: any;
}
interface MainBoxState {
  refreshing: boolean;
  down: boolean;
  height: any;
  winHight: number;
}
type Props = MainBoxProps;
let pageNum = 1;
class MainBox extends React.Component<Props, MainBoxState> {
  ptr: any;
  constructor(props) {
    super(props);
    const thisDocument: any = document.documentElement;
    this.state = {
      refreshing: false,
      down: false,
      height: thisDocument.clientHeight,
      winHight: 0,
    };
  }

  componentDidMount() {
    const winhig = window.innerHeight;
    const thisDom: any = ReactDOM.findDOMNode(this.ptr);
    // eslint-disable-next-line
    const hei = this.state.height - thisDom.offsetTop;
    this.setState({
      height: hei,
      winHight: winhig,
    });
  }

  // componentWillReceiveProps(nextProps) {
  //     this.setState({ refreshing: false });
  // }
  clearReload(flag) {
    this.setState({ refreshing: flag });
  }

  upPull = () => {
    this.setState({ refreshing: true });
    pageNum += 1;
    this.props.upPull(pageNum);
  };

  clearPageNum = num => {
    pageNum = num;
  };

  render() {
    return (
      <div className="main-box">
        <PullToRefresh
          damping={60}
          ref={el => {
            this.ptr = el;
          }}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          distanceToRefresh={25}
          onRefresh={this.upPull}>
          {this.props.data.length ? (
            <MainCell data={this.props.data} height={0} />
          ) : (
            <div className="non-data" style={{ minHeight: `${this.state.winHight}px` }}>
              <NotForecast title="暂无数据" titleTwo="" />
            </div>
          )}
        </PullToRefresh>
      </div>
    );
  }
}
export default MainBox;
