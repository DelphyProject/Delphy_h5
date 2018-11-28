import React from 'react';
import { showToast } from '@/utils/common';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './lockDesc.less';
import CountDown from '../../findScene/detailScene/components/_countDown';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import AlertInfo from './alertInfo/index';
import { getNowTimestamp } from '@/utils/time';
interface LockState {
  data: any;
  showAlert: boolean;
}
type Props = DispatchProp & RouteComponentProps;
class Lock extends React.Component<Props, LockState> {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      data: null,
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchLockInfo(result => {
        if (result.code == 200) {
          this.setState({
            data: result.data,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  showMethod = () => {
    // sessionStorage.setItem('transactionInfo', JSON.stringify(result.data))
    this.setState({
      showAlert: true,
    });
  };

  hideMethod = () => {
    this.setState({
      showAlert: false,
    });
  };

  onSuccess = () => {
    this.getData();
    this.hideMethod();
  };

  render() {
    // let lokedDPY = sessionStorage.getItem('lokedDPY')
    const dataJson = this.state.data;
    // let currentUnlockDpy;
    let dpyLocked;
    let nextTimeUnlockDpy;
    let nextTime;
    let lemp;
    if (dataJson) {
      // eslint-disable-next-line
      nextTimeUnlockDpy = dataJson.nextTimeUnlockDpy;
      lemp = dataJson.nextTime - getNowTimestamp();
      // eslint-disable-next-line
      dpyLocked = dataJson.dpyLocked;
      sessionStorage.setItem('dpyLocked', dpyLocked);
      // eslint-disable-next-line
      // currentUnlockDpy = dataJson.currentUnlockDpy;
      // eslint-disable-next-line
      nextTime = dataJson.nextTime;
    } else {
      lemp = 0;
      nextTime = 0;
      // currentUnlockDpy = 0;
      nextTimeUnlockDpy = 0;
      dpyLocked = 0;
    }

    return (
      <div className="lockDesc">
        <Helmet>
          <title>锁定</title>
        </Helmet>
        <div>
          {this.state.data != null ? (
            <div>
              {/* {
                                this.state.showAlert ?
                                    <AlertBox unLockAmount={currentUnlockDpy}
                                        lockDPY={dpyLocked}
                                        hideMethod={this.hideMethod}
                                        onSuccess={this.onSuccess}
                                    /> :
                                    false
                            } */}
              <AlertInfo />
              <div className="topBox">
                <div className="top1">
                  <div className="text1Box">
                    <span className="left">锁定(DPY)</span>
                    <div className="link-right">
                      <span className="icon-info iconfont icon-Group1" />
                      <Link className="link-item" to="/me/contact">
                        有疑问？联系我们
                      </Link>
                    </div>
                  </div>
                  <div className="text2Box">
                    {' '}
                    <span>{dpyLocked}</span>
                    {/* <span className="detail" onClick={() => {
                                        this.props.history.push('/me/unlockProgress')
                                    }} >详情 ></span> */}
                  </div>
                  <div className="text3Box">
                    {nextTime == 0 ? (
                      <span className="textStyle1" />
                    ) : (
                      <span className="textStyle2">
                        <CountDown getData={this.getData} date={lemp} />
                        后解锁 <span className="textNum">{nextTimeUnlockDpy}</span> dpy
                      </span>
                    )}
                  </div>
                </div>
                {/* <div className="lines"></div>
                                <div className="top2">
                                    <div className="leftItem">当前解锁额度</div>
                                    <div className="rightItem" onClick={
                                        () => {
                                            this.props.history.push('/me/lockRecord')
                                        }
                                    }
                                    ><span className="nums">{currentUnlockDpy} DPY</span><span className="icon-public_narrow_list_m iconfontMarket back rightIcon"  ></span></div>
                                </div> */}
              </div>
              <div className="midBtnBox">
                <button
                  type="button"
                  className="leftBtn"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    // this.showMethod()
                    this.props.history.push('/me/unlockProgress');
                  }}>
                  查看详情
                </button>
                {/* <button className="rightBtn" onClick={() => {
                                    this.props.history.push('/me/invite')
                                }}  >获取解锁额度</button> */}
              </div>
              <div className="desc">
                <p className="title">说明:</p>
                <p className="itemTitle">1.DPY的锁定状态 </p>
                <p className="itemContent">
                  若用户预测错误，则投资的DPY将会被锁定。锁定后的DPY将不能进行预测、提现等操作。达到解锁时间后，将会解除锁定。{' '}
                </p>
                <p className="itemTitle">2.锁定时间 </p>
                <p className="itemContent">30天，即DPY被锁定30天后，才能解除锁定。 </p>
                {/* <p className='itemTitle' >3.提前解锁 </p>
                                <p className='itemContent'>可以使用“解锁额度”提前解锁DPY，解锁额度通过邀请用户注册获得。 </p> */}
                <p className="itemTitle">3.注意 </p>
                <p className="itemContent">本功能最终解释权归天算基金会所有。 </p>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
        {/* <button className="contactUs">
                    <span className="iconfontMarket icon_8 icon-Group1"></span>
                    <span className="contactText"
                        onClick={
                            () => {
                                this.props.history.push('/me/contact')
                            }
                        }
                    >有疑问？联系我们</span>
                </button> */}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.messageState,
});

export default connect(mapStateToProps)(Lock);
