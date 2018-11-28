import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import NewEmail from './_newEmail/sendVerification';

interface NewEmailPageProps {
  serverData: any;
}
interface NewEmailPageState {
  email: string;
}
type Props = NewEmailPageProps & DispatchProp;

class NewEmailPage extends React.Component<Props, NewEmailPageState> {
  constructor(props) {
    super(props);
    this.state = {
      email: 'laiwhenf@abc.com',
    };
  }

  render() {
    return (
      <div>
        <NewEmail email={this.state.email} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(NewEmailPage);
