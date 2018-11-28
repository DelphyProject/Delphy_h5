import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Address from './_address';

class AddressPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>充值</title>
        </Helmet>
        <Address />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(AddressPage);
