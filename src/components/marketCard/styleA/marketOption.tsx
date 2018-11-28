import React, { Component } from 'react';
import { Flex } from 'antd-mobile';
import Chart from './chart';

interface MarketOptionProps {
  nowPrice: number;
  optionData: any;
}

interface MarketOptionState {
  nowPrice: number;
}

class MarketOption extends Component<MarketOptionProps, MarketOptionState> {
  constructor(props) {
    super(props);
    this.state = {
      nowPrice: this.props.nowPrice,
    };
  }

  render() {
    const { optionData } = this.props;
    return (
      <div>
        <div className="choice text13">
          <span className="pull-right">{optionData.holdShares}份</span>
          {optionData.title}
        </div>
        <Flex>
          <div className="multiple3Page">
            <div className="multiple text24 red">
              {(((1 - this.props.nowPrice) / this.props.nowPrice) * 100).toFixed(0)}
              <span className="xx text12Red ">%</span>
              <div className="info text9">获胜收益</div>
            </div>
          </div>
          <div className="chart">
            <Chart
              id={optionData.id}
              chartData={optionData.histPrice}
              holdAvgPrice={optionData.holdAvgPrice}
            />
          </div>
        </Flex>
      </div>
    );
  }
}

export default MarketOption;
