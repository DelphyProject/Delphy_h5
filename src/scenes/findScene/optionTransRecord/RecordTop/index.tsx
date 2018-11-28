import React from 'react';
import './RecordTop.less';
interface RecordTopProps {
  data: any;
}
export default class RecordTop extends React.Component<RecordTopProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    return (
      <div className="outBoxRecord">
        {this.props.data.length == 0 ? (
          <div>正在努力获取数据</div>
        ) : (
          <div>
            <h5 className="text13">{data.title}</h5>
            <div className="lineNotMar" />
            <div className="itemCardBox">
              <div className="lineCard">
                {
                  //     <div className="itemCard">
                  //     <p className="text9 p2">总收益</p>
                  //     <p className="text17 p1">
                  //         <span className="textTitle">{(total!=0)?total.toFixed(2):0}</span>
                  //         <span className="text9">DPY</span>
                  //     </p>
                  //
                  // </div>
                }
                <div className="itemCard">
                  <p className="text9 p2">总成本</p>
                  <p className="text17 p1">
                    <span className="textTitle">{(data.totalOutcome - 0).toFixed(2)}</span>
                    <span className="text9">DPY</span>
                  </p>
                </div>
                <div className="itemCard">
                  <p className="text9 p2">持有均价</p>
                  <p className="text17 p1">
                    <span className="textTitle">
                      {data.holdAvgPrice && data.holdAvgPrice != 0
                        ? (data.holdAvgPrice - 0).toFixed(2)
                        : '--'}
                    </span>
                    <span className="text9">DPY</span>
                  </p>
                </div>
                <div className="itemCard">
                  <p className="text9 p2">持有份数</p>
                  <p className="text17 p1">
                    <span className="textTitle">{data.holdShares}</span>
                    <span className="text9">份</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
