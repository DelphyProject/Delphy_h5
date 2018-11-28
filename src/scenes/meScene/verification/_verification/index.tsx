import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { showToast } from '@/utils/common';
import './verification.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '@/redux/actions/actions_fetchServerData';

interface VerificationPage1Props {
  serverData: any;
}
interface VerificationPage1State {
  status: number | string;
  reason: string;
}
type Props = VerificationPage1Props & DispatchProp & RouteComponentProps;

const KYCStatus = {
  NoKYC: 1,
  KYC1Failed: 2,
  KYC1Pending: 3,
  KYC1: 4,
  KYC2Failed: 5,
  KYC2Pending: 6,
  KYC2: 7,
  KYC5Failed: 8,
  KYC5Pending: 9,
  KYC5: 10,
};

class VerificationPage1 extends React.Component<Props, VerificationPage1State> {
  constructor(props) {
    super(props);
    this.state = {
      status: KYCStatus.NoKYC,
      reason: '',
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.queryKycStatus(result => {
        if (result.code == 200) {
          this.setState({
            status: result.data.status,
            reason: result.data.reason,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  renderStatus() {
    if (this.state.status < KYCStatus.KYC2) {
      return (
        <p className="verificationPrompt">
          您还未进行身份验证，无法进行提现和转账操作。通过KYC2即可获赠30预测币。
        </p>
      );
    }
    if (this.state.status == KYCStatus.KYC2) {
      return <p className="verificationPrompt">您已通过KYC2身份验证。</p>;
    }
    // Unknown status
    return <p>Unknown KYC status. Please fix it.</p>;
  }

  renderKYC2() {
    let button;
    if (this.state.status < KYCStatus.KYC2Failed) {
      // Not yet completed
      button = (
        <Link to="/me/verification/kyc2">
          <input type="button" value="去认证" readOnly={true} />
        </Link>
      );
    } else if (this.state.status == KYCStatus.KYC2Failed) {
      button = (
        <Link to="/me/verification/kyc2">
          <input type="button" value="再次认证" readOnly={true} />
        </Link>
      );
    } else if (this.state.status == KYCStatus.KYC2Pending) {
      button = (
        <input type="button" className="verificationInputH" value="审核中" readOnly={true} />
      );
    } else {
      // Completed
      button = (
        <input type="button" className="verificationInputH" value="已经认证" readOnly={true} />
      );
    }
    return (
      <div className="verification verificationTwo">
        <h4>KYC2</h4>
        <p>可转账</p>
        <p>可提现</p>
        <pre>需上传身份证正反面照片</pre>
        {this.state.status == KYCStatus.KYC2Failed ? (
          <div>
            <div className="horizontalLine" />
            <p className="failedReason">
              <span className="failedLabel">审核不通过：</span>
              {this.state.reason}
            </p>
          </div>
        ) : null}
        {button}
      </div>
    );
  }

  renderKYC5() {
    return (
      <div className="verification verificationTwo">
        <h4>KYC5</h4>
        <pre>未开放</pre>
        <input type="button" className="verificationInputH" value="未开放" readOnly={true} />
      </div>
    );
  }

  render() {
    return (
      <div className="verificationPage">
        {this.renderStatus()}
        {this.renderKYC2()}
        {this.renderKYC5()}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.loginUserState,
});

export default connect(mapStateToProps)(withRouter(VerificationPage1));
