import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Verification from './_verification';

class VerificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>身份认证</title>
        </Helmet>

        <Verification />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(VerificationPage);
