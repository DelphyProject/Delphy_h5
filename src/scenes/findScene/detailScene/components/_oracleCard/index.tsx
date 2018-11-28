import React from 'react';
import { Flex } from 'antd-mobile';
import './oracleCard.less';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const MARKET_ONGOING = 100;
// const MARKET_WAITING_SETTLED = 200;
// const MARKET_APPEALING = 400;
// const MARKET_COMPLETED = 300;
interface OracleCardProps {
  type: number;
  data: any;
  loadingOracle: boolean;
  getOracle: any;
  marketTagType?: number; //判断是不是未来行情 1 是，0 其他
  serverData: any;
}
interface OracleCardState {
  mType: number;
}
type Props = OracleCardProps & DispatchProp & RouteComponentProps;
class OracleCard extends React.Component<Props, OracleCardState> {
  constructor(props) {
    super(props);
    this.state = {
      mType: this.props.marketTagType || 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      mType: nextProps.marketTagType,
    });
  }
  toFutureRecord = () => {
    this.props.history.push(`/future/record`);
  };

  render() {
    const { type, data, loadingOracle } = this.props;
    const { marketDetailData } = this.props.serverData;
    //是否是未来市场 模拟
    const futureData = marketDetailData.coinInfoVO;
    let imgSrc;
    if (futureData) {
      switch (futureData.coinId) {
        case 5:
          imgSrc = require('@/img/future/btc.png');
          break;
        case 6:
          imgSrc = require('@/img/future/eth.png');
          break;
        case 7:
          imgSrc = require('@/img/future/eos.png');
          break;
      }
    } else {
      imgSrc = '';
    }
    let oracleItem;
    let value;
    let title;
    let fontStyle;
    let styleClassName = this.state.mType === 1 ? 'futureBg' : 'normalBg';
    let idName = 'normarlOracleInfo';
    switch (type) {
      case MARKET_ONGOING:
        fontStyle = { color: '#333333' };
        break;
      default:
        fontStyle = { color: '#909294' };
        styleClassName += ' completedMarket';
        break;
    }
    if (loadingOracle) {
      oracleItem = (
        <div className="notOracle">
          <div className="notOraclePage">
            <img src={require('../../../../../img/tail-spin.svg')} alt="" />
            内容加载中...
          </div>
        </div>
      );
    } else {
      if (this.state.mType === 1 && futureData) {
        oracleItem = (
          <Flex
            style={{
              width: '100%',
              height: '100%',
              marginLeft: '0.15rem',
            }}
            justify="between">
            <div>
              <span>{futureData.coinName}</span>
              <div className="oracleTit">
                当前价格$
                {futureData.currentPrice}
              </div>
            </div>
            <div>
              <div className="oracleVal" style={fontStyle}>
                <span>{futureData.accuracyRate}</span>
                <div
                  className="iconfont icon-ic_history historyRecord"
                  onClick={this.toFutureRecord}
                />
              </div>
              <div className="oracleTit">历史胜率</div>
            </div>
            <Flex direction="column" align="end" style={fontStyle}>
              <span className="greenContent">{futureData.riseOrFall}</span>
              <div className="oracleTit">本日涨跌幅</div>
            </Flex>
          </Flex>
        );
      } else if (data) {
        if (data.length !== 0) {
          oracleItem = (
            <Flex
              style={{
                width: '100%',
                height: '100%',
                marginLeft: '0.15rem',
              }}
              justify="around">
              {data.map((val, key) => {
                val.value.length == 0 ? (value = '---') : (value = val.value.slice(0, 12));
                title = val.title.slice(0, 11);
                return (
                  <div key={key}>
                    <div className="oracleVal" style={fontStyle}>
                      <span className="content">{value}</span>
                    </div>
                    <div className="oracleTit">{title} </div>
                  </div>
                );
              })}
            </Flex>
          );
        } else {
          idName = '';
          oracleItem = null;
        }
      } else {
        oracleItem = (
          <div className="notOracle">
            <div className="notOraclePage">
              数据加载失败{' '}
              <span
                style={{ color: '#434dff', marginLeft: 5 }}
                onClick={this.props.getOracle ? this.props.getOracle : false}>
                {' '}
                点击
              </span>
              重新加载
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        <div id={idName} className={styleClassName}>
          <div className="oracleCard">
            {this.state.mType === 1 && futureData ? <img className="iconImg" src={imgSrc} /> : null}
            {oracleItem}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});
export default connect(mapStateToProps)(withRouter(OracleCard));
