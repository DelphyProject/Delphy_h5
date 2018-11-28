import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { WhiteSpace, Flex } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isLogin } from '@/utils/tool';
import { getNowTimestamp } from '@/utils/time';
import CountDown from '@/scenes/findScene/detailScene/components/_countDown';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import MarketOption from './marketOption';
import { showToast } from '@/utils/common';

import '../marketCard.less';

interface StyleProps {
  data: any;
}

interface StyleState {
  subscribed: any;
  collectNum: number;
  isCollecting: boolean;
}

type Props = StyleProps & RouteComponentProps & DispatchProp;

class StyleC extends Component<Props, StyleState> {
  constructor(props) {
    super(props);
    this.state = {
      subscribed: this.props.data.subscribed,
      collectNum: this.props.data.numSubscriber,
      isCollecting: false,
    };
  }

  _collect() {
    if (!isLogin(true)) {
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.collect(this.props.data.id, result => {
        if (result.code == 200) {
          showToast('收藏成功', 2);
          this.setState({
            subscribed: true,
            isCollecting: false,
            collectNum: this.state.collectNum + 1,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  _unCollect() {
    if (!isLogin(true)) {
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.unCollect(this.props.data.id, result => {
        if (result.code == 200) {
          showToast('取消收藏', 2);
          this.setState({
            isCollecting: false,
            subscribed: false,
            collectNum: this.state.collectNum - 1,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  handleCardClick = () => {
    this.props.history.push(`/market/${this.props.data.id}`);
  };

  handleItemClick = () => {
    if (this.state.isCollecting) {
      return;
    }
    this.setState({
      isCollecting: true,
    });
    this.state.subscribed ? this._unCollect() : this._collect();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  render() {
    const { data } = this.props;
    const fontCollect = {
      color: '#ffaf52',
    };
    const fontUncollect = {
      color: '#8893a4',
    };
    const fonstyle = this.state.subscribed ? fontCollect : fontUncollect;
    return (
      <div id="card">
        <div>
          <div onClick={this.handleCardClick}>
            <div className="text17">{data.title}</div>
            <div className="left_time text11">
              剩余时间：
              <CountDown date={data.endTime - getNowTimestamp()} getData={undefined} />
            </div>
            <div className="message">
              <span className="icon-public_icon_news ico" />
              {data.news[0] ? data.news[0].content : ''}
            </div>

            {data.options.map((option, key) => (
              <div key={key}>
                {key == 0 ? (
                  <div>
                    <MarketOption
                      nowPrice={option.price - 0}
                      optionData={option}
                      totalNum={data.numInvestor}
                    />
                    <WhiteSpace size="lg" />
                  </div>
                ) : (
                  false
                )}
              </div>
            ))}
          </div>
        </div>
        <hr className="LineMargin" />
        <Flex justify="center" className="marketFoot">
          <Flex.Item>
            <div className="marketFootIn">
              <span className="icon-public_icon_num ico" />
              {data.numInvestor}
            </div>
          </Flex.Item>
          <Flex.Item>
            <div className="marketFootIn" onClick={this.handleItemClick}>
              <span style={fonstyle} className="icon-public_icon_Collect ico" />
              {this.state.collectNum}
            </div>
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketDetailState,
});
const marketCard = withRouter(StyleC);

export default connect(mapStateToProps)(marketCard);
