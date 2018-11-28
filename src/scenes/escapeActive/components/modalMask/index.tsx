import React from 'react';
import './modalMask.less';

const stopTouch = e => {
  e.preventDefault();
};
const ModalMask = props => (
  <div className="mask-warp" onClick={stopTouch}>
    <div className="mask-bg" />
    <div className="mask-content">
      <div className="mask-title">活动规则</div>
      <div className="mask-body">
        1.所有参与吃鸡专场的用户需要在对应时间内参加专题下的预测话题。预测正确者将进入下一轮，预测失败者将出局。
        <br />
        2.用户参与活动需缴纳入场费，入场费将直接注入奖池（即参与人数越多奖池越高）。
        <br />
        3.当吃鸡专场内所有的市场都结束时，活动结束幸存者将平分奖池。
        <br />
        4.若在活动结束前，所有参与者都已出局，活动将结束，没有人获胜，奖池将会累积到下一场。
        <br />
        5.未在规定时间参与制定预测话题，视为出局。
        <br />
      </div>
      <div className="mask-btn" onClick={props.maskClose}>
        我知道了
      </div>
    </div>
  </div>
);
export default ModalMask;
