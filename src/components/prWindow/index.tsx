import React from 'react';
import './proWindow.less';

interface PromptWindowProps {
  copySuccess: string;
}

class PromptWindow extends React.Component<PromptWindowProps> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: true,
      InputExpand: false,
    };
  }

  render() {
    return <div className="prompeWindow">{this.props.copySuccess}</div>;
  }
}

export default PromptWindow;
