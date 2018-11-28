import React from 'react';
import { Flex } from 'antd-mobile';
import './oracleCard.less';
import { connect, DispatchProp } from 'react-redux';

const MARKET_ONGOING = 1;
const MARKET_WAITING_SETTLED = 2;
const MARKET_APPEALING = 4;
const MARKET_COMPLETED = 3;
interface OracleCardProps {
  type: number;
  data: any;
  loadingOracle: boolean;
  getOracle: any;
}
type Props = OracleCardProps & DispatchProp;
class OracleCard extends React.Component<Props> {
  render() {
    const { type, data, loadingOracle } = this.props;
    let oracleItem;
    let value;
    let title;
    let fontStyle;
    let styleClassName;
    let idName = 'oracleInfo';
    switch (type) {
      case MARKET_ONGOING:
        fontStyle = { color: '#212529' };
        styleClassName = 'ongoingMarket';
        break;
      case MARKET_WAITING_SETTLED:
        fontStyle = { color: '#909294' };
        styleClassName = 'completedMarket';
        break;
      case MARKET_COMPLETED:
        fontStyle = { color: '#909294' };
        styleClassName = 'completedMarket';
        break;
      case MARKET_APPEALING:
        fontStyle = { color: '#909294' };
        styleClassName = 'completedMarket';
        break;
      default:
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
    } else if (data) {
      if (data.length != 0) {
        oracleItem = data.map((val, key) => {
          val.value.length == 0 ? (value = '---') : (value = val.value.slice(0, 12));
          title = val.title.slice(0, 11);
          return (
            <div className="center" key={key}>
              <div className="oracleVal" style={fontStyle}>
                {value}
              </div>
              <div className="text9 oracleTit">{title} </div>
            </div>
          );
        });
      } else {
        idName = '';
        oracleItem = <div />;
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
    return (
      <div>
        <div id={idName} className={styleClassName}>
          <div style={{ marginBottom: 12 }}>
            <Flex>{oracleItem}</Flex>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});

export default connect(mapStateToProps)(OracleCard);
