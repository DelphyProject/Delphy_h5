import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ComplaintReason from '@/scenes/other/appeal/_complaintReason/_complaintReason';
import TextArea from '@/scenes/other/appeal/_textArea/_textArea';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import { isLogin } from '@/utils/tool';
interface AppealProps {
  serverData: any;
}
interface AppealState {
  reasonArr: any;
}
type Props = AppealProps & DispatchProp & RouteComponentProps;
class AppealPage extends React.Component<Props, AppealState> {
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
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchAppealPage('123'),
    );
  }

  // tslint:disable-next-line:variable-name
  _appeal = val => {
    if (!isLogin(true)) return;
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

  reasonFunc = val => {
    this.setState({ reasonArr: val });
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
