import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Setting from './_setting';

class SettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>设置</title>
        </Helmet>

        <Setting />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(SettingPage);
