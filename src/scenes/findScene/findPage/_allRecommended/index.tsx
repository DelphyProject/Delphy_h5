import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import AllRecommended from './allRecommended';

class ARecommended extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>全部推荐人</title>
        </Helmet>
        <AllRecommended />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  marketPageState: store.marketPageState,
});

export default connect(mapStateToProps)(ARecommended);
