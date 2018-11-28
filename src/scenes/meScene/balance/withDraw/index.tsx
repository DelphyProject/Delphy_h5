import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Withdraw from './_withdraw';

class WithdrawPage extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>提现</title>
        </Helmet>
        <Withdraw />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(WithdrawPage);
