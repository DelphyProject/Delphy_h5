import React from 'react';
import { withRouter } from 'react-router-dom';
import './_textArea.less';
interface TextAreaProps {
  data: any;
  callback: any;
}
class TextArea extends React.Component<TextAreaProps> {
  content: any;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="TextArea">
        <div className="reason">{this.props.data.textAreaTitle}</div>
        <div className="line" />

        <div className="content_out">
          <textarea
            className="content"
            ref={c => {
              this.content = c;
            }}
            placeholder="最多输入24个字"
            maxLength={24}
          />
        </div>
        <div className="submit_out">
          <input
            type="button"
            className="inputBtn"
            value="提交"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.callback(this.content.value);
            }}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(TextArea);
