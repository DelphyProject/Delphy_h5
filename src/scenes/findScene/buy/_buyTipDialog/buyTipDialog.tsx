import React from 'react';
import './buyTipDialog.less';
interface BuyTipDialogProps {
  hidden: boolean;
  info: any;
  onConfirm: any;
  text: string;
}
interface BuyTipDialogState {
  hidden: boolean;
}
export default class BuyDialog extends React.Component<BuyTipDialogProps, BuyTipDialogState> {
  constructor(props) {
    super(props);
    this.state = {
      hidden: this.props.hidden,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hidden: nextProps.hidden,
    });
  }

  render() {
    return this.state.hidden ? (
      false
    ) : (
      <div className="sign0utCoverPage">
        <div className="sign0utCover" />
        <div className="sign0utCoverIn">
          <p>{this.props.info}</p>
          <div className="lineNotMar" />
          <ul
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.setState({
                hidden: true,
              });
              this.props.onConfirm();
            }}>
            {this.props.text}
          </ul>
        </div>
      </div>
    );
  }
}
