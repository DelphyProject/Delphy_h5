import React from 'react';
import './styleHotComments.less';
import Reply from '../_replyItem/_replyItem';
interface ReplysProps {
  ClassBordser: string;
  data: any;
  onChoose: any;
}
export default class Replys extends React.Component<ReplysProps> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: false,
    };
  }

  render() {
    return (
      <div>
        <div className="dividingLine" />
        <div className={this.props.ClassBordser}>
          {/* {this.props.title?<p className="commentState">{this.props.title}</p>:false} */}

          {this.props.data.map((dataitem, k) => (
            <Reply
              data={dataitem}
              dataS={this.props.data}
              key={k}
              length={k}
              onChoose={this.props.onChoose}
            />
          ))}
        </div>
      </div>
    );
  }
}
