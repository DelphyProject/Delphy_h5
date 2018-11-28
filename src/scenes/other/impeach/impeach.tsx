import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ComplaintReason from '../appeal/_complaintReason/_complaintReason';
import TextArea from '../appeal/_textArea/_textArea';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import { isLogin } from '../../../utils/tool';

let reasonArr: any = [];
interface ImpeachProps {
  serverData: any;
  type: number;
}
type Props = ImpeachProps & DispatchProp & RouteComponentProps;
class Impeach extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    //@ts-ignore
    this.props.dispatch(fetchData.fetchImpeachPage('123'));
  }

  // tslint:disable-next-line:variable-name
  _reportComment = val => {
    if (reasonArr.length == 0) {
      showToast('请选择举报原因', 2);
      return;
    }
    if (!isLogin(true)) {
      return;
    }
    const params: any = {};
    let reason = '';
    reasonArr.forEach(value => {
      reason += `${value.label} `;
    });
    params.reason = `${reason} ${val}`;
    if (this.props.type == 0) {
      this.props.dispatch(
        //@ts-ignore
        fetchData.reportComment(this.props.id, params, ret => {
          if (ret.code == 200) {
            this.props.history.goBack();
          } else {
            showToast(ret.msg, 2);
          }
        }),
      );
    } else {
      this.props.dispatch(
        //@ts-ignore
        fetchData.reportReply(this.props.id, params, ret => {
          if (ret.code == 200) {
            showToast('举报成功', 2);
            this.props.history.goBack();
          } else {
            showToast(ret.msg, 2);
          }
        }),
      );
    }
  };

  reasonFunc = val => {
    reasonArr = val;
  };

  render() {
    const { complaintReasonData, textAreaData } = this.props.serverData;

    return (
      <div>
        <Helmet>
          <title>举报</title>
        </Helmet>
        <ComplaintReason callback={this.reasonFunc} data={complaintReasonData} />
        <TextArea callback={this._reportComment} data={textAreaData} />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.impatchState,
});
const impeachPage = withRouter(Impeach);
export default connect(mapStateToProps)(impeachPage);
