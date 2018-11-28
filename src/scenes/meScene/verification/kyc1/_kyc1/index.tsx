import React from 'react';
import './kyc1.less';

class Kyc1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="kyc1Page">
        <div className="kycName kyc">
          <p>姓名</p>
          <input type="text" placeholder="请输入姓名" />
        </div>
        <div className="kycCertificates kyc">
          <p>证件号</p>
          <input type="text" placeholder="请输入证件号码" />
        </div>
        <div className="kycCertificatesTwo kyc">
          <p>确认证件号</p>
          <input type="text" placeholder="请再次输入证件号码" />
        </div>
        <input type="button" className="kycBtn" value="认证" />
      </div>
    );
  }
}

export default Kyc1;
