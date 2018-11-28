import React from 'react';
import './index.less';

const DetailInfo = () => (
  <div className="detail-info">
    <div className="share-top">
      <div className="share-header">
        <img className="star-icon" src={require('./../../../../img/share-top.jpg')} />
        <span>被邀请好友注册后可领取福利</span>
      </div>
      <div className="share-total">
        <div className="gift-icon">
          <img src={require('./../../../../img/gift-icon.png')} />
        </div>
        <span>=</span>
        <div className="gift-icon1">
          <img src={require('@/img/share-icon1.jpg')} />
        </div>
        <span>+</span>
        <div className="gift-icon2">
          <img src={require('./../../../../img/dpy-icon.png')} />
        </div>
      </div>
      <div className="other-info">
        <p className="detaile-title">说明</p>
        <p className="detail-item">
          1.每个邀请一名新用户注册天算后，您可以获得10预测币(每日最多10次)，同时被邀请人即可获得20预测币，预测币可被用于参与天算预测，获取更多天算DPY。
        </p>
        <p className="detail-item">
          2.被邀请人注册后，若在天算中预测获胜3场，您可再获得1DPY+20预测币。
        </p>
        <p className="detail-item">
          3.若发现有任何不正当行为，例如造假、刷量、误导用户等，一经发现，将取消其相关奖励。
        </p>
        <p className="detail-item">4.本功能最终解释权归天算基金会所有。</p>
      </div>
    </div>
  </div>
);
export default DetailInfo;
