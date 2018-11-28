import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './recordItem.less';
import { formatTime } from '@/utils/time';
interface RecordItemProps {
  data: any;
}
type Props = RecordItemProps & RouteComponentProps;
class RecordItem extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
    };
  }

  componentDidMount() {
    // [{ color: this.state.color, borderColor: this.state.color }]
  }

  render() {
    const buyColor = {
      borderColor: '#424cfe',
      color: '#424cfe',
      backgroundColor: '#fff',
    };
    const sellColor = {
      borderColor: '#f94b4b',
      color: '#f94b4b',
      backgroundColor: '#fff',
    };
    const bonus = {
      borderColor: '#ffaf52',
      color: '#ffaf52',
      backgroundColor: '#fff',
    };
    const recharge = {
      borderColor: '#3ebd55',
      color: '#3ebd55',
      backgroundColor: '#fff',
    };
    const withdraw = {
      borderColor: '#3ccce8',
      color: '#3ccce8',
      backgroundColor: '#fff',
    };

    return (
      <div className="recordOutBox">
        {this.props.data.map((val, index) => {
          let colorStyle;
          let tip;
          let plusMinus = '+';
          if (val.transType == 0) {
            colorStyle = recharge;
            tip = '充';
          } else if (val.transType == 1) {
            colorStyle = buyColor;
            tip = '买';
            plusMinus = '-';
          } else if (val.transType == 2) {
            colorStyle = sellColor;
            tip = '卖';
          } else if (val.transType == 3) {
            colorStyle = withdraw;
            tip = '提';
            plusMinus = '-';
          } else if (val.transType == 4) {
            colorStyle = bonus;
            tip = '奖';
          }
          let tips;
          if (val.status == 0) {
            tips = '操作失败';
          } else if (val.status == 1) {
            tips = '处理中';
            // }else if(val.status==2){

            // }else if(val.status==3){
          }

          return (
            <div
              key={index}
              className="recordItemBox"
              onClick={
                // tslint:disable-next-line:jsx-no-lambda
                () => {
                  this.props.history.push(`/me/transactionDetailPage/${val.id}`);
                }

                // <Link to="/me/transactionDetailPage">tree</Link>
              }>
              <div className="recordLeft">
                <div style={colorStyle} className="buyFont">
                  {tip}
                </div>
                <div className="FontContent">
                  <p className="record_p1">{val.marketTitle}</p>
                  <p className="record_p4">{val.optionDesc}</p>
                  <p className="record_p2">{formatTime(val.createTime)}</p>
                </div>
              </div>
              <p className="record_p3">{plusMinus + (val.cost - 0).toFixed(2)} DPY</p>
              <p className="recordResult">{tips}</p>
              <div className="lineNotMar" />
            </div>
          );
        })}
      </div>
    );
  }
}
export default withRouter(RecordItem);
