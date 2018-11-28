import React from 'react';
import { Flex } from 'antd-mobile';

interface MarketOptionProps {
  optionData: any;
  data: any;
}

class MarketOption extends React.Component<MarketOptionProps> {
  render() {
    const { optionData, data } = this.props;
    const income = data.totalIncome - 0;
    const outcome = data.totalOutcome - 0;
    const total = income - outcome;
    // (totalIncome-0)-(totalOutcome-0)!=0?((totalIncome-0)-(totakrlOutcome-0)).toFixed(8):0
    return (
      <div>
        <div className="choice text13">
          <p className="choiceP">获胜选项</p>
          {optionData.title}

          <div className="mt-12 text11">
            {optionData.numInvestor}
            人参与
          </div>
        </div>
        <div className="line" />
        <Flex className="outcome" justify="center">
          <div className="text15">
            总收益
            <span className="red">{total.toFixed(2)}</span>
          </div>
          <div className="vline" />
          <div className="text15">
            总收益率
            <span className="red">
              {income == 0 ? 0 : (((income - outcome) / outcome) * 100).toFixed(0)}%
            </span>
          </div>
        </Flex>
      </div>
    );
  }
}

export default MarketOption;
