import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Option from './marketOption';

interface MarketCardProps {
  data: any;
}

type Props = MarketCardProps & RouteComponentProps;

class MarketCard extends React.Component<Props> {
  handleClick = () => {
    const { data } = this.props;
    this.props.history.push(`/market/${data.id}`);
  };

  render() {
    const { data } = this.props;
    let tip;
    switch (data.status) {
      case 2:
        tip = '等待清盘';
        break;
      case 3:
        tip = '已清盘';
        break;
      case 4: // 申诉期间
        tip = '等待结算';
        break;

      default:
        break;
    }
    return (
      <div>
        <div onClick={this.handleClick}>
          <div id="card">
            <div>
              <div className="text17">{data.title}</div>
              <div className="left_time text11">{tip}</div>
              <div className="message">
                <span className="icon-public_icon_news ico" />
                {data.news && data.news != 0 ? data.news[0].content : false}
              </div>
            </div>
            {data.options.map((option, key) => (
              <div key={key}>
                {!option.selected ? (
                  <div />
                ) : (
                  <div>
                    <Option optionData={option} data={data} />
                  </div>
                )}
              </div>
            ))}
            <div className="line-full" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MarketCard);
