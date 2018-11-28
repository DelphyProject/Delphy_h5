import React from 'react';
import { Flex } from 'antd-mobile';
import NumberParticipants from '../../numberParticipants';

interface MarketOptionProps {
  totalNum: number;
  nowPrice: number;
  optionData: any;
}

class MarketOption extends React.Component<MarketOptionProps> {
  render() {
    return (
      <div>
        <div className="choice">
          <p>最高收益</p>
          {this.props.optionData.title}
        </div>

        <div style={{ margin: '0.2rem 0' }}>
          <Flex className="flexPage">
            <Flex.Item>
              <div className="multiple text24 red">
                {(((1 - this.props.nowPrice) / this.props.nowPrice) * 100).toFixed(0)}
                <span className="xx text12Red">%</span>
                <div className="info text9">获胜收益</div>
              </div>
            </Flex.Item>
            <Flex.Item>
              <NumberParticipants
                id={this.props.optionData.unique_id_of_the_front}
                paticipantsVolume={this.props.optionData.numInvestor}
                totalNum={this.props.totalNum}
              />
            </Flex.Item>
            <Flex.Item>
              <div className="multiple text24">
                {this.props.nowPrice.toFixed(2)}
                <span
                  className={
                    this.props.optionData.trend == 'up'
                      ? 'icon-public_narrow_upordown arrowUp'
                      : 'icon-public_narrow_upordown arrowDown'
                  }
                />
                <div className="info text9">当前价格</div>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
  }
}

export default MarketOption;
