import React from 'react';
import { DispatchProp } from 'react-redux';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import './launchComment.less';
import { showToast } from '@/utils/common';
interface LaunchCommentProps {
  data: any;
  hideBox: any;
}
interface LaunchCommentState {
  content: string;
}
type Props = LaunchCommentProps & DispatchProp;
export default class LaunchComment extends React.Component<Props, LaunchCommentState> {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  sendComment = () => {
    if (this.state.content.length <= 0) {
      showToast('内容不能为空', 2);
      return;
    }
    const params: any = {};
    params.mid = this.props.data.id;
    params.content = this.state.content;
    params.optionId = 1;
    this.props.dispatch(
      //@ts-ignore
      fetchData.comment(params, result => {
        if (result.code == 200) {
          showToast('评论成功', 2);
          this.props.hideBox();
        } else {
          showToast(result.msg, 2);
        }
        this.setState({
          // statusCode: !this.state.statusCode,
          content: '',
        });
      }),
    );
  };

  onInput = e => {
    this.setState({
      content: e.target.value,
    });
  };

  render() {
    return (
      <div id="alertOut">
        <div className="content">
          SSSSSSSSSSSSSSSSSSSSSSSS
          <div>选项A</div>
          <div>选项B</div>
          <button
            type="button"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.props.hideBox();
            }}>
            关闭
          </button>
          <br />
          <input
            // tslint:disable-next-line:jsx-no-lambda
            onChange={e => {
              this.onInput(e);
            }}
          />{' '}
          <button
            type="button"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              this.sendComment();
            }}>
            发表评论
          </button>
        </div>
      </div>
    );
  }
}
