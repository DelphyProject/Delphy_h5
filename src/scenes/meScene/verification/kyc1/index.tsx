import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Kyc1 from './_kyc1';

class Kyc1Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>KYC1</title>
        </Helmet>
        <Kyc1 />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(Kyc1Page);
