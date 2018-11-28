import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { timestampToTime } from '@/utils/time';
import './exChange.less';
interface ExChange1Props {
  serverData: any;
}
type Props = ExChange1Props & DispatchProp;

class ExChange extends React.Component<Props> {
  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.exchange(result => {
        if (result.code == 200) {
          // let endTime = timestampToTime(result.data.updateTime);
          // this.setState({
          //     dpyCny:result.data.dpyCny,
          //     time:endTime
          // })
        }
      }),
    );
  }

  refreshClick = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.exchange(result => {
        if (result.code == 200) {
          // let endTime = timestampToTime(result.data.updateTime);
          // this.setState({
          //     dpyCny:result.data.dpyCny,
          //     time:endTime
          // })
        }
      }),
    );
  };

  render() {
    const { exchange } = this.props.serverData;
    let endTime;
    if (exchange.updateTime) {
      endTime = timestampToTime(exchange.updateTime);
    } else {
      endTime = ' --  --  --';
    }

    return (
      <div>
        <Helmet>
          <title>兑换</title>
        </Helmet>
        <div className="exchangePage pricePage">
          <div className="exchangeHead">
            <h4>最新价格:</h4>
            <h5>
              {exchange.dpyCny
                ? (Number(exchange.dpyCny) + Number(exchange.dpyCny) * 0.08).toFixed(2)
                : 0}{' '}
              <span>RMB</span>
            </h5>
            <p>
              <span>
                原价:
                {exchange.dpyCny ? Number(exchange.dpyCny).toFixed(2) : 0}
                RMB
              </span>
              <span>
                溢价8%=
                {exchange.dpyCny ? (Number(exchange.dpyCny) * 0.08).toFixed(2) : 0}
              </span>
              <span>转账手续费=0</span>
            </p>
          </div>
          <div className="priceTime">
            <p>
              更新时间:
              {endTime}
            </p>
            <p>交易所: Gate.io</p>
            <div onClick={this.refreshClick}>点击刷新</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.exchange,
});

export default connect(mapStateToProps)(ExChange);
