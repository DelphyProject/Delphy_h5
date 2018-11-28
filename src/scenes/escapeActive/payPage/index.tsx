import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HeadBanner } from '../components/headBanner/index';
import { showAlert } from '../components/toastModal/index';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import LoginAlert from '@/components/loginAlert/loginAlert';
import { showToast } from '@/utils/common';

import './payPage.less';

interface UserPayProps {
  payData: any;
}

interface UserPayState {
  height: number;
  isLoading: boolean;
  isLoginShow: boolean;
}

type Props = UserPayProps & DispatchProp & RouteComponentProps;

class UserPay extends React.Component<Props, UserPayState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoginShow: false,
      height: 0,
    };
  }

  componentWillMount() {
    this.setState({
      height: window.innerHeight,
    });
    this.setState({ isLoading: true });
    // @ts-ignore
    this.props.dispatch(fetchData.getCurrentActiveDetail(this.props.id));
  }

  // 点击确定按钮
  confirmAdd = () => {
    const token = window.localStorage.getItem('token');
    const id = this.props.payData.currentData.activityId;
    if (!token) {
      this.setState({
        isLoginShow: true,
      });
      return;
    }
    this.props.dispatch(
      // @ts-ignore
      fetchData.payActive(id, res => {
        if (res.code == 200 || res.code == 41025) {
          if (res.code == 200) {
            showToast('恭喜您报名成功！', 3);
            setTimeout(() => {
              this.props.history.push(`/escape/activeMarketList/${id}`);
            }, 2000);
          }
          if (res.code == 41025) {
            this.props.history.push(`/escape/activeMarketList/${id}`);
          }
        } else {
          showAlert(res.msg, this.toFindPage, this.toMarketList, res.code);
        }
      }),
    );
  };

  // 路由跳转(首页)
  toFindPage = () => {
    this.props.history.push('/find');
  };

  // 路由跳转(市场列表页)
  toMarketList = () => {
    this.props.history.push(
      `/escape/activeMarketList/${this.props.payData.currentData.activityId}`,
    );
  };

  costFixed = num => (num ? num.toFixed(2) : '20.00');

  // 隐藏去登录的alert mask
  hideAlert = () => {
    this.setState({ isLoginShow: false });
  };

  render() {
    return (
      <div
        className="body-warp-pay"
        style={{
          minHeight: this.state.height,
        }}>
        <Helmet>
          <title>吃鸡专场</title>
        </Helmet>
        {this.state.isLoginShow ? (
          <LoginAlert info="你尚未登录，请登录" text="去登录" hideAlert={this.hideAlert} />
        ) : null}
        {/* 页面头部 */}
        <HeadBanner isShare={false} url={this.props.payData.currentData.image} />
        {/* 页面主体 */}
        <div className="pay-box">
          <div className="content-box">
            <div className="pay-title">花费(DPY)</div>
            <p className="pay-money">
              {!!this.props.payData.currentData.cost &&
                this.costFixed(this.props.payData.currentData.cost)}
            </p>
          </div>
          <div className="other-info">
            {/* 成功吃鸡后，可与其他胜利者均分{this.props.payData.currentData.reward}DPY奖池并拿回投入成本；
            若失败，投入成本将被锁定{this.props.payData.currentData.dpyFreezeDay}天。 */}
            您的报名费将被汇入奖池，待吃鸡结束后全部奖池将由获胜者瓜分
          </div>
        </div>
        {/* <div className="submit-btn" onClick={showAlert}>确 定</div> */}
        <div className="submit-btn" onClick={this.confirmAdd}>
          确 定
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({ payData: store.escapeMarketList });

export default connect(mapStateToProps)(withRouter(UserPay));
