import React from 'react';
import { Checkbox } from 'antd-mobile';
import './_complaintReason.less';

const { CheckboxItem } = Checkbox;

let reasonChoosed: Array<any> = [];
interface ComplaintReasonProps {
  callback: any;
  data: any;
}
export default class ComplaintReason extends React.Component<ComplaintReasonProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    reasonChoosed = [];
  }

  onChange = (val, item) => {
    if (val.target.checked) {
      reasonChoosed.push(item);
    } else {
      reasonChoosed.splice(reasonChoosed.indexOf(item), 1);
    }
    this.props.callback(reasonChoosed);
  };

  render() {
    return (
      <div id="complaintReason">
        {this.props.data.length == 0 ? (
          <div>加载中</div>
        ) : (
          <div>
            <div className="reason">*{this.props.data.complaintReasonDataTitle}</div>
            <div className="line" />
            {this.props.data.complaintReasonDataContent.map(item => (
              // tslint:disable-next-line:jsx-no-lambda
              <CheckboxItem key={item.typeID} onChange={val => this.onChange(val, item)}>
                {item.label}
              </CheckboxItem>
            ))}
          </div>
        )}
      </div>
    );
  }
}
