import React from 'react';
import MarketOngoingCard from './styleA';
import MarketCompleteCard from './styleB';
import MarketPopularCard from './styleC';
import './marketCard.less';

interface MarketCardProps {
  showStyle: string;
  data: any;
}

const MARKET_ONGOING = 'MARKET_ONGOING';
const MARKET_COMPLETE = 'MARKET_COMPLETE';
const MARKET_POPULAR = 'MARKET_POPULAR';
const MARKET_FRESH = 'MARKET_FRESH';

class MarketCard extends React.Component<MarketCardProps> {
  render() {
    let content = <div />;
    switch (this.props.showStyle) {
      case MARKET_ONGOING:
        content = <MarketOngoingCard data={this.props.data} />;
        break;
      case MARKET_COMPLETE:
        content = <MarketCompleteCard data={this.props.data} />;
        break;
      case MARKET_POPULAR:
        this.props.data.options.forEach(item => {
          item.unique_id_of_the_front = MARKET_POPULAR + item.id;
        });
        content = <MarketPopularCard data={this.props.data} />;
        break;
      case MARKET_FRESH:
        this.props.data.options.forEach(item => {
          item.unique_id_of_the_front = MARKET_FRESH + item.id;
        });
        content = <MarketPopularCard data={this.props.data} />;
        break;
      default:
        break;
    }
    return <div>{content}</div>;
  }
}

export default MarketCard;
