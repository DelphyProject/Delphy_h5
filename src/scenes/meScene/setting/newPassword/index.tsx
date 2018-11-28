import React from 'react';
import { connect } from 'react-redux';
import NewPassword from './_newPassword/sendVerification';

class NewPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <NewPassword />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(NewPasswordPage);
