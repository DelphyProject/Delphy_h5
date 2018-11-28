import React from 'react';
import { Helmet } from 'react-helmet';
import MainBody from '../mine/body/index';
import DetailInfo from './detailInfo/index';
import './index.less';

interface InviteProps {}
interface InviteState {
  height: any;
}
type Props = InviteProps;
class Invite extends React.Component<Props, InviteState> {
  constructor(props) {
    super(props);
    this.state = {
      height: '0px',
    };
  }

  componentDidMount = () => {
    this.setState({
      height: `${window.innerHeight}px`,
    });
  };

  render() {
    return (
      <div className="invite-warp" style={{ minHeight: this.state.height }}>
        <Helmet>
          <title>邀请</title>
        </Helmet>
        <div className="header-warp">
          <div className="top-banner">
            <MainBody hidden={true} />
          </div>
        </div>
        <DetailInfo />
        {/* <Tabs /> */}
      </div>
    );
  }
}
export default Invite;
