import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ProfileEdit from './_profileEdit/_profileEdit';

class ProfileEditPage extends React.Component {
  render() {
    const thisUser = sessionStorage.getItem('user');
    if (!thisUser) return;
    const userProfile = JSON.parse(thisUser);
    const nickname = (userProfile && userProfile.nickname) || '';
    return (
      <div>
        <Helmet>
          <title> {`${nickname}资料设置`}</title>
        </Helmet>

        <ProfileEdit {...userProfile} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.mePageState,
});

export default connect(mapStateToProps)(ProfileEditPage);
