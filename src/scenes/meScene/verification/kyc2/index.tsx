import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Kyc2 from './_kyc2';

class Kyc2Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // tslint:disable-next-line:no-empty
  componentDidMount() {}

  render() {
    return (
      <div>
        <Helmet>
          <title>KYC2</title>
        </Helmet>
        <Kyc2 />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(Kyc2Page);
