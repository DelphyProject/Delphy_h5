import React from 'react';
import { Checkbox } from 'antd-mobile';
import './_complaintReason.less';

const CheckboxItem = Checkbox.CheckboxItem;

let reasonChoosed = [];
interface ComplaintReasonProps {
  data: any;
  callback: any;
}
type Props = ComplaintReasonProps;
export default class ComplaintReason extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    reasonChoosed = [];
  }

  onChange = (val, item: any) => {
    if (val.target.checked) {
      //@ts-ignore
      reasonChoosed.push(item);
    } else {
      //@ts-ignore
      reasonChoosed.splice(reasonChoosed.indexOf(item), 1);
    }
    this.props.callback(reasonChoosed);
  };

  render() {
    return (
      <div id="complaintReason" className="complaintReasonMarket">
        {this.props.data.length == 0 ? (
          <div>加载中</div>
        ) : (
          <div>
            <div className="reason">
              <span className="starTag">*</span>
              {this.props.data.complaintReasonDataTitle}
            </div>
            <div className="line" />
            {this.props.data.complaintReasonDataContent.map((item, index) => (
              // tslint:disable-next-line:jsx-no-lambda
              <CheckboxItem key={index} onChange={val => this.onChange(val, item)}>
                {item.label}
              </CheckboxItem>
            ))}
          </div>
        )}
      </div>
    );
  }
}
