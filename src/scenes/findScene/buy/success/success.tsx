import React from 'react';
import { Helmet } from 'react-helmet';
import './success.less';
import { RouteComponentProps } from 'react-router-dom';
import { formatTime, getNowTimestamp } from '@/utils/time';
type Props = RouteComponentProps;
export default class Success extends React.Component<Props> {
  renderCost(result) {
    if (result.dummyCost == 0) {
      return `${result.cost} DPY`;
    }
    return `${result.cost} DPY, ${result.dummyCost} 预测币`;
  }

  renderBalance(result) {
    if (result.dummyCost == 0) {
      return `${result.balance} DPY`;
    }
    return `${result.balance} DPY, ${result.dummyBalance} 预测币`;
  }

  render() {
    const tranInfo: any = sessionStorage.getItem('transactionInfo');
    const result = JSON.parse(tranInfo);
    const transTime = formatTime(result.createTime);
    const endTime: any = sessionStorage.getItem('endTime');
    const nowTime = getNowTimestamp();
    const time = endTime - 0 - nowTime;
    return (
      <div>
        <Helmet>
          <title>支持成功</title>
        </Helmet>
        <div className="buySuccessPage">
          <div className="Successpackage">
            <div className="buySuccessHead">
              <img src={require('../../../../img/find/done.png')} alt="" />
              <p>支持成功</p>
              <span className="left" />
              <span className="right" />
            </div>
            <div className="buySuccessInner">
              <div className="buySuccessDetails">
                <p>成交份数</p>
                <p>{result.amount}份</p>
              </div>
              <div className="buySuccessDetails">
                <p>成交单价</p>
                <p>{result.price} DPY</p>
              </div>
              <div className="buySuccessDetails">
                <p>成交总额</p>
                <p>{this.renderCost(result)}</p>
              </div>
              <div className="buySuccessDetails">
                <p>成交时间</p>
                <p>{transTime}</p>
              </div>
              <div className="buySuccessDetails">
                <p>余额</p>
                <p>{this.renderBalance(result)}</p>
              </div>
              <div className="buySuccessConnent">
                <p>当前话题评论</p>
                <p
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    sessionStorage.setItem('invested', '1');
                    sessionStorage.setItem('holdOptionId', result.optionId);
                    sessionStorage.setItem('commentOptions', JSON.stringify(result.optionVOList));
                    const status = time > 0;
                    sessionStorage.setItem('status', status + '');

                    this.props.history.push(`/comment/${result.marketId}`);
                  }}>
                  查看
                  <span>&gt;</span>
                </p>
              </div>
              <div
                className="buySuccessBtn"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => {
                  this.props.history.push('/mymarket');
                }}>
                查看我参与的话题
              </div>
              <div className="backBtnOut">
                <div
                  className="backBtn"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    sessionStorage.setItem('topNum1Bool', '0');
                    sessionStorage.setItem('topNum2Bool', '0');
                    sessionStorage.setItem('topNum3Bool', '0');
                    sessionStorage.setItem('topNum4Bool', '0');
                    sessionStorage.setItem('topNum5Bool', '0');
                    this.props.history.push('/');
                  }}>
                  返回首页
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
