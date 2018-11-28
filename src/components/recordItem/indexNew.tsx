import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './recordItemNew.less';
import { ethUrl } from '@/config';
import { formatTime } from '@/utils/time';

interface RecordItemProps {
  height: number;
  data: Array<any>;
}

interface RecordItemState {
  height: number;
  color: string;
  isPhoneGap: boolean;
}

type Props = RecordItemProps & RouteComponentProps;

class RecordItem extends React.Component<Props, RecordItemState> {
  public state: Readonly<RecordItemState> = {
    height: 0,
    color: 'red',
    isPhoneGap: !!parent.isPhoneGap,
  };

  componentDidMount() {
    const winHeight = window.innerHeight;
    this.setState({ height: winHeight - 45 });
  }

  handleItemClick = (val: any) => {
    return () => {
      if (val.transType == 0 || val.transType == 3) {
        if (val.txHash) {
          if (this.state.isPhoneGap) {
            parent.openLinkInbBrowser(ethUrl + val.txHash);
          } else {
            window.open(ethUrl + val.txHash, '_system');
          }
        }
      } else if (!(val.transType == 4 || val.transType == 5 || val.transType == 12)) {
        this.props.history.push(`/me/transactionDetailPage/${val.id}`);
      }
    };
  };

  render() {
    return (
      <div className="recordOutBox" style={{ minHeight: `${this.state.height}px` }}>
        {this.props.data.map((val, index) => {
          let title = '';
          let plusMinus = '';
          const total = (0 + val.cost + val.fee + val.dummyCost).toFixed(2);
          const dummyCost = (0 + val.dummyCost).toFixed(2);
          let option = '';
          let detail = '';
          let cssClass = '';

          if (val.transType == 0 || val.transType == 55) {
            title = '充值';
            plusMinus = '+';
            option = val.address;
            cssClass = 'recordDeposit';
            if (val.transType == 55) {
              option = '币圈英雄提币';
            }
          } else if (val.transType == 1 || val.transType == 50 || val.transType == 51) {
            plusMinus = '-';
            option = `${val.optionDesc}(${val.amount}份)`;
            if (val.dummyCost == 0) {
              // All real coin
              detail = `DPY ${(0 + val.cost).toFixed(2)}，手续费 ${(0 + val.fee).toFixed(2)}`;
            } else if (val.cost == 0) {
              // All dummy coin
              detail = `预测币 ${(0 + val.dummyCost).toFixed(2)}，手续费 ${(0 + val.fee).toFixed(
                2,
              )}`;
            } else {
              // Mixed
              detail = `DPY ${(0 + val.cost).toFixed(2)}，预测币 ${(0 + val.dummyCost).toFixed(2)}`;
            }

            cssClass = 'recordBuy';
          } else if (val.transType == 2) {
            cssClass = 'recordSell';
          } else if (val.transType == 3) {
            title = '提现';
            plusMinus = '-';
            option = val.address;
            detail = `提现额${(0 + val.cost).toFixed(2)}，手续费${(0 + val.fee).toFixed(2)}`;
            cssClass = 'recordWithdraw';
          } else if (
            val.transType == 4 ||
            val.transType == 16 ||
            val.transType == 52 ||
            val.transType == 53
          ) {
            plusMinus = '+';
            cssClass = 'recordAward';
          } else if (
            val.transType == 5 ||
            val.transType == 12 ||
            val.transType == 13 ||
            val.transType == 15
          ) {
            plusMinus = '+';
            cssClass = 'recordBack';
          } else if (val.transType == 6 || val.transType == 14) {
            plusMinus = '+';
            cssClass = 'recordLock';
          } else if (val.transType == 7 || val.transType == 8) {
            plusMinus = '+';
            cssClass = 'recordUnlock';
          } else if (val.transType == 20) {
            // Transfer out
            title = `转出 - ${val.transferUserNickname}`;
            plusMinus = '-';
            cssClass = 'transferOut';
          } else if (val.transType == 21 || val.transType == 54) {
            if (val.transType == 21) {
              // Transfer in
              title = `转入 - 来自 ${val.transferUserNickname}`;
            }
            if (val.transType == 54) {
              title = '转入 - 解锁额度转预测币 ';
            }
            plusMinus = '+';
            cssClass = 'transferIn';
          } else if (val.transType == 30 || val.transType == 31) {
            title = '获赠预测币';
            plusMinus = '+';
            cssClass = 'transferIn';
          } else if (val.transType == 40) {
            title = `转出 - ${val.userNickname}`;
            plusMinus = '-';
            cssClass = 'transferOut';
          } else if (val.transType == 41) {
            title = `转入 - ${val.userNickname}`;
            plusMinus = '+';
            cssClass = 'transferIn';
          }
          let tips;
          if (val.status == 0) {
            tips = val.transType == 3 ? '审核不通过' : '操作失败';
          } else if (val.status == 1) {
            tips = '处理中';
          } else if (val.status == 3) {
            tips = '已完成';
          }

          if (val.transType == 7 || val.transType == 8) {
            return '';
          }

          let displayCost;
          if (val.transType == 30) {
            displayCost = plusMinus + dummyCost;
          } else {
            displayCost = plusMinus + total;
          }

          return (
            <div key={index} className="recordItemBoxtt" onClick={this.handleItemClick(val)}>
              <div className={`recordLeft ${cssClass}`} />
              <div className="recordRight">
                <div className="con">
                  <span className="title">{val.marketTitle ? val.marketTitle : title}</span>
                  <span className="amount">{displayCost}</span>
                </div>
                {/* <div className="con">
                                            <span className="option">{val.optionDesc || tips}</span>
                                            <span className="time">{formatTime(val.createTime)}</span>
                                        </div> */}
                <div className="con">
                  <span className="option">{option}</span>
                  <span className="detail">{detail}</span>
                </div>
                <div className="con">
                  <span className="time">{formatTime(val.createTime)}</span>
                  <span className="status">{tips}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default withRouter(RecordItem);
