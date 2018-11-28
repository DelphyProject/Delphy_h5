import React from 'react';
import Copy from 'copy-to-clipboard';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './exChange.less';
import { showToast } from '@/utils/common';
interface ExChangeProps {
  serverData: any;
}
type Props = ExChangeProps & DispatchProp;

class ExChange extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.exchange(result => {
        if (result.code == 200) {
          return;
        }
      }),
    );
  }

  copyWXEvent = () => {
    const { exchange } = this.props.serverData;
    Copy(exchange.delphyWeChat);
    showToast('复制微信成功', 2);
  };

  render() {
    const { exchange } = this.props.serverData;
    return (
      <div>
        <Helmet>
          <title>兑换</title>
        </Helmet>
        <div className="exchangePage">
          <div className="exchangeWXExplain">
            <p>1.单笔兑换不得超过20DPY。</p>
            <p>2.仅支持应用内及Dapp内转账。</p>
            <p>3.打款前请务必和卖家沟通，确认对方是否在线。</p>
            <p>4.除官方认可的第三方兑换服务外，请勿相信其他兑换渠道。</p>
          </div>
          <div className="exchangeWX">
            <div className="exchangeWXData">
              <div>
                <img src={require('../../../img/wxhead.jpg')} alt="" />
              </div>
              <div>
                <h4>{exchange.delphyNickName}</h4>
                <p>{exchange.delphyWeChat}</p>
              </div>
            </div>
            <div onClick={this.copyWXEvent} className="exchangeWXBtn">
              点击复制微信号
            </div>
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
