import React from 'react';
import { Helmet } from 'react-helmet';
import './lockRecord.less';
import { RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { showToast } from '@/utils/common';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import * as fetchTypes from '../../../../redux/actions/fetchTypes';
import NotForecast from '../../../../components/notForecast';
import NotNetwork from '../../../../components/notNetwork';
import Loading from '../../../../components/loading';
import { formatTime } from '../../../../utils/time';

let recordBoxScorll;
const recordPage = 10;
let perPage = 1;
let recordBoxScorllState = 1;
interface LockRecordProps {
  serverData: any;
}
interface LockRecordState {
  connter: string;
}
type Props = LockRecordProps & DispatchProp & RouteComponentProps;
class LockRecord extends React.Component<Props, LockRecordState> {
  constructor(props) {
    super(props);
    this.state = {
      connter: '',
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: fetchTypes.CLEAR_UNLOCKRECORD_DATA,
    });
    const params = {
      page: perPage,
      per_page: recordPage,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchUnlockRecord(params, result => {
        recordBoxScorllState = 2;
        if (result.code == 200) {
          if (result.data.length == recordPage) {
            perPage = 2;
            recordBoxScorllState = 1;
          }
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  scrollMarket = () => {
    recordBoxScorll = document.getElementById('recordBox');
    const scrollTop = recordBoxScorll.scrollTop;
    // 获取当前元素的可视区域
    const clientHeight = Math.max(recordBoxScorll.clientHeight, recordBoxScorll.clientHeight);
    // 获取文档完整的高度"findMarketFiexd"
    const getScrollHeight = Math.max(recordBoxScorll.scrollHeight, recordBoxScorll.scrollHeight);

    if (clientHeight + scrollTop >= getScrollHeight - 10 && recordBoxScorllState == 1) {
      const params = {
        page: recordPage,
        per_page: perPage,
        status: 1,
      };
      this.props.dispatch(
        //@ts-ignore
        fetchData.fetchUnlockRecord(params, result => {
          recordBoxScorllState = 2;
          if (result.code == 200) {
            if (result.data.length == recordPage) {
              perPage++;
              recordBoxScorllState = 1;
            } else {
              this.setState({
                connter: '没有更多数据',
              });
            }
          } else {
            showToast(result.msg, 2);
          }
        }),
      );
    }
  };

  render() {
    const { records, isLoading, serverError } = this.props.serverData;
    const dpyLocked = sessionStorage.getItem('dpyLocked');
    return (
      <div className="lockRecord">
        <Helmet>
          <title>解锁记录</title>
        </Helmet>
        <div className="top1">
          <div className="text1Box">
            {' '}
            <span>锁定(DPY)</span>
          </div>
          <div className="text2Box">
            {' '}
            <span>{dpyLocked}</span>
          </div>
          <div className="text3Box"> 1 </div>
        </div>
        <div className="midBtnBox">
          <button
            type="button"
            className="rightBtn"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.history.push('/me/invite');
            }}>
            获取解锁额度
          </button>
        </div>
        <p className="recordTitle">解锁额度记录</p>
        <div className="recordBox" id="recordBox" onScroll={this.scrollMarket}>
          {serverError ? (
            <NotNetwork />
          ) : (
            <div>
              {isLoading ? (
                <div className="loadingBox">
                  <Loading />
                </div>
              ) : (
                <div>
                  {records == '' ? (
                    <NotForecast title="暂无解锁记录！" titleTwo="" />
                  ) : (
                    <div>
                      {records.map((val, index) => (
                        <div key={index} className="itemBox">
                          <div className="leftItem">
                            <p className="top">{val.typeName}</p>
                            <p className="bom">{formatTime(val.time, 'YYYY-MM-DD HH:mm:ss')}</p>
                          </div>
                          <div className="rightItem">
                            {val.type == 8 ? (
                              <span className="text2">
                                {' '}
                                {val.dpy == 0 ? val.dpy : `-${val.dpy}`}
                              </span>
                            ) : (
                              false
                            )}
                            {val.type == 1 ? (
                              <span className="text1">
                                {val.dpy == 0 ? val.dpy : `+${val.dpy}`}
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                      ))}
                      <p className="recordBoxConnter">{this.state.connter}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.unlockRecordState,
});
export default connect(mapStateToProps)(LockRecord);
