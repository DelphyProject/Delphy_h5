import React from 'react';
import './clickWindow.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ClickWindowProps {
  transMoney?: number;
  PromptTxt: string;
}

type Props = ClickWindowProps & RouteComponentProps;

class ClickWindow extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConfirmBtnClick = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="clickWindow">
        <div className="window">
          <p className="PromptTxt">{this.props.PromptTxt}</p>
          {this.props.transMoney ? (
            <p className="transMoney">
              交易成交价：
              {this.props.transMoney.toFixed(2)}
              DPY
            </p>
          ) : (
            false
          )}
          <div className="lineNotMar" />
          <pre onClick={this.handleConfirmBtnClick}>确定</pre>
        </div>
      </div>
    );
  }
}

const windowPage = withRouter(ClickWindow);

export default windowPage;
