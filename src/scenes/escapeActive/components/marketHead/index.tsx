import React from 'react';
import './marketHead.less';
import { survivorRate, initNum } from '../../commonjs/time';
// 将数字格式化（以逗号分隔3位数字）
// const initNum = num => {
//     let result = [], counter = 0;
//     num = (num || 0).toString().split('');
//     for (let i = num.length - 1; i >= 0; i--) {
//         counter++;
//         result.unshift(num[i]);
//         if (!(counter % 3) && i != 0) { result.unshift(','); }
//     }
//     return result.join('');
// }
// 计算淘汰人数
const outUser = (total, survivor) => {
  if (total == undefined || total == null || isNaN(total) == true) {
    total = 0;
  }
  if (survivor == undefined || survivor == null || isNaN(survivor) == true) {
    survivor = 0;
  }
  return initNum(total - survivor);
};
// 页面渲染组件
const MarketHead = props => {
  const { data } = props;
  return (
    <div className="head-warp">
      <div className="content-box">
        {data.userStatus == 1 || data.userStatus == 2 ? (
          <img
            className="out-img"
            src={require('./../../../../img/chicken/img_marketing_list_out.png')}
          />
        ) : null}
        <div className="num-title">当前存活(人)</div>
        <div className="main-num">{initNum(data.survivor)}</div>
        <div className="rate-warp">
          <span className="rate-num">
            存活率
            {survivorRate(data.numInvestor, data.survivor)}
          </span>
        </div>
        <div className="detail-warp">
          <div className="detail-item">
            <p>本期奖池(DPY)</p>
            <p>{props.currentPrizePool ? initNum(props.currentPrizePool) : initNum(data.reward)}</p>
          </div>
          <div className="detail-item">
            <p>总参与人数</p>
            <p>{props.numInvestor ? initNum(props.numInvestor) : initNum(data.numInvestor)}</p>
          </div>
          <div className="detail-item">
            <p>已淘汰人数</p>
            <p>{outUser(data.numInvestor, data.survivor)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarketHead;
