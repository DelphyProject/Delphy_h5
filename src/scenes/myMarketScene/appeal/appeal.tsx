import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ComplaintReason from './_complaintReason/_complaintReason';
import TextArea from './_textArea/_textArea';
import { getNowTimestamp } from '@/utils/time';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
interface AppealPageProps {
  serverData: any;
}
interface AppealPageState {
  reasonArr: any;
}
type Props = AppealPageProps & DispatchProp & RouteComponentProps;
class AppealPage extends React.Component<Props, AppealPageState> {
  constructor(props) {
    super(props);
    this.state = {
      reasonArr: [],
    };
  }

  componentWillMount() {
    this.setState({
      reasonArr: [],
    });
    //@ts-ignore
    this.props.dispatch(fetchData.fetchAppealPage('123'));
  }

  // tslint:disable-next-line:variable-name
  _appeal = val => {
    const loginState: any = localStorage.getItem('loginState');
    if (loginState != 1) {
      showToast('请登录', 2);
      return;
    }
    const nowTime = getNowTimestamp();
    const effectiveTime: any = localStorage.getItem('effectiveTime');
    if (effectiveTime - nowTime <= 3) {
      showToast('账号信息过期，请重新登录', 2);
      return;
    }
    if (!this.state.reasonArr || this.state.reasonArr == 0) {
      showToast('请至少选择一项原因', 2);
      return;
    }
    const params: any = {};
    let reason = '';
    this.state.reasonArr.forEach((value, index) => {
      if (index == this.state.reasonArr.length - 1) {
        reason += value.label;
      } else {
        reason += `${value.label},`;
      }
    });
    params.reason = `${reason}@${val}`;
    this.props.dispatch(
      //@ts-ignore
      fetchData.appeal(this.props.marketId, params, ret => {
        if (ret.code == 200) {
          showToast('申诉成功', 2);
          this.props.history.goBack();
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  };

  // submitFunc=(val)=>{
  // }
  reasonFunc = val => {
    this.setState({
      reasonArr: val,
    });
  };

  render() {
    const { complaintReasonData, textAreaData } = this.props.serverData;
    return (
      <div>
        <Helmet>
          <title>申诉</title>
        </Helmet>
        <ComplaintReason callback={this.reasonFunc} data={complaintReasonData} />
        <TextArea callback={this._appeal} data={textAreaData} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.appealState,
});

export default connect(mapStateToProps)(withRouter(AppealPage));
