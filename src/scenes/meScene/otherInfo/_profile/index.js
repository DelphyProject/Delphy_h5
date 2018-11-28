import React from 'react';
import { withRouter } from 'react-router-dom';
import './profile.less';

class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let avatar;
    if (this.props.avatar) {
      if (this.props.avatar.indexOf('.bkt') > 0) {
        avatar = `${this.props.avatar}?imageView2/1/w/100/h/100`;
      } else {
        // eslint-disable-next-line
        avatar = this.props.avatar;
      }
    } else {
      avatar = require('../../../../img/my_photo_none.png');
    }

    return (
      <div className="datumPackground">
        <div
          className="datumInner"
          onClick={() => {
            if (this.props.from == 1) {
              return;
            }
            sessionStorage.setItem('user', JSON.stringify(this.props));

            this.props.history.push('/me/editInfo');
          }}>
          <dl className="datumTop">
            <dd>
              <img src={avatar} alt="" />
            </dd>
            <dt>
              <h4 className="text17">{this.props.nickname}</h4>
              <p className="description">{this.props.description}</p>
              {this.props.from == 1 ? false : <span className="icon-public_icon_back_normal" />}
            </dt>
          </dl>
        </div>
      </div>
    );
  }
}

export default withRouter(profile);
