import React, { Component } from 'react';
import { Flex } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import Option from './marketOption';
import CountDown from '../../../scenes/findScene/detailScene/components/_countDown';
import * as fetchTypes from '../../../redux/actions/fetchTypes';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import { isLogin } from '../../../utils/tool';
import { getNowTimestamp } from '@/utils/time';
import { showToast } from '@/utils/common';
interface StyleAProps {
  data: any;
}

interface StyleAState {
  subscribed: any;
  collectNum: any;
  isCollecting: boolean;
}

type Props = StyleAProps & DispatchProp & RouteComponentProps;

class StyleA extends Component<Props, StyleAState> {
  constructor(props) {
    super(props);
    this.state = {
      subscribed: this.props.data.subscribed,
      collectNum: this.props.data.numSubscriber,
      isCollecting: false,
    };
  }

  private collect() {
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

  private unCollect() {
    if (!isLogin(true)) {
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.unCollect(this.props.data.id, result => {
        if (result.code == 200) {
          showToast('取消收藏', 2);
          this.setState({
            subscribed: false,
            isCollecting: false,
            collectNum: this.state.collectNum - 1,
          });
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  }

  private putTop = () => {
    if (!isLogin(true)) {
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.top(this.props.data.id, result => {
        if (result.code == 200) {
          showToast('置顶成功', 2);
          this.props.dispatch({
            type: fetchTypes.PUT_TOP,
            id: this.props.data.id,
          });
          window.location.reload();
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  private cancelTop = () => {
    if (!isLogin(true)) {
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.cancelTop(this.props.data.id, result => {
        if (result.code == 200) {
          showToast('取消置顶', 2);
          this.props.dispatch({
            type: fetchTypes.CANCEL_TOP,
            id: this.props.data.id,
          });
          window.location.reload();
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  handleCardClick = () => {
    const { data, history } = this.props;
    history.push(`/market/${data.id}`);
  };

  handleCollectBtnClick = () => {
    if (this.state.isCollecting) {
      return;
    }
    this.setState({
      isCollecting: true,
    });
    this.state.subscribed ? this.unCollect() : this.collect();
  };

  handleSetTopBtnClick = () => {
    const { data } = this.props;
    !data.isTop ? this.putTop() : this.cancelTop();
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
      <div>
        <div>
          <div id="card">
            <div onClick={this.handleCardClick}>
              <div>
                <div className="text17">{data.title}</div>
                <div className="left_time text11">
                  剩余时间：
                  <CountDown date={data.endTime - getNowTimestamp()} getData={undefined} />
                </div>
                <div className="message">
                  <span className="icon-public_icon_news ico" />
                  {data.news && data.news != 0 ? data.news[0].content : false}
                </div>
              </div>
              {data.options.map((option, key) => {
                if (option.holdShares <= 0) {
                  return null;
                }

                return (
                  <div key={key}>
                    <Option optionData={option} nowPrice={option.price} />
                    {key == data.options.length - 1 ? <div /> : <div className="line" />}
                  </div>
                );
              })}
            </div>

            <Flex justify="between" className="footer">
              <div>
                <span className="icon-public_icon_num ico" style={{ float: 'left' }} />
                {data.numInvestor}
              </div>
              <div onClick={this.handleCollectBtnClick}>
                <span style={fonstyle} className="icon-public_icon_Collect ico CollectionIcon" />
                {this.state.collectNum}
              </div>
              <div
                className="pull-right"
                style={data.isTop ? fontCollect : fontUncollect}
                onClick={this.handleSetTopBtnClick}>
                <span className="icon-public_icon_stick ico" style={{ float: 'left' }} />
                <span style={{ color: '#8893a4' }}> {data.isTop ? '取消置顶' : '置顶'}</span>
              </div>
            </Flex>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.marketPageState,
});

const marketCard = withRouter(StyleA);

export default connect(mapStateToProps)(marketCard);
