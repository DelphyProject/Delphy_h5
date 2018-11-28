import React from 'react';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './input.less';

let matchWords = 0;
interface DetailInputProps {
  options: any;
  invested: boolean;
  id: number;
  holdOptionId: number;
  toUser: any;
  status: number;
  goHome: any;
  loginAlert1: any;
}
interface DetailInputState {
  content: string;
  InputExpand: boolean;
  tid: string;
  optionId: any;
  selectStyle: string;
  value: number;
  options: any;
}
type Props = DetailInputProps & DispatchProp;
class Input extends React.Component<Props, DetailInputState> {
  constructor(props) {
    super(props);
    this.state = {
      InputExpand: false,
      tid: '',
      content: '',
      optionId: 0,
      selectStyle: 'noSelct',
      value: 0,
      options: this.props.options,
    };
  }

  sendComment() {
    if (this.state.content.length <= 0) {
      showToast('内容不能为空', 2);
      return;
    }
    if (!this.props.invested) {
      if (!this.state.optionId) {
        showToast('请选择支持选项', 2);
        return;
      }
    }
    const params: any = {};
    params.mid = this.props.id;
    params.content = this.state.content;
    if (this.props.invested) {
      params.optionId = this.props.holdOptionId;
    } else {
      params.optionId = this.state.optionId;
    }

    this.props.dispatch(
      //@ts-ignore
      fetchData.comment(params, result => {
        if (result.code == 200) {
          showToast('评论成功', 2);
        } else {
          showToast(result.msg, 2);
        }
        this.clearStyle();
        this.setState({
          InputExpand: false,
          content: '',
          optionId: null,
        });
        const marketDetailPage: any = document.getElementById('marketDetailPage');
        marketDetailPage.style.overflow = 'auto';
        // document.getElementById('marketDetailPage').style.overflow = "auto";
      }),
    );
  }

  setOptionId = id => {
    this.state.options.forEach(val => {
      if (id == val.id) {
        val.isSelected = true;
      } else {
        val.isSelected = false;
      }
    });
    this.setState({
      optionId: id,
      options: this.state.options,
    });
  };

  clearStyle = () => {
    this.state.options.forEach(val => {
      val.isSelected = false;
    });
    this.setState({
      options: this.state.options,
    });
  };

  // TODO: 抽象成工具方法
  getLength(str) {
    let realLength = 0;
    const len = str.length;
    let charCode = -1;
    for (let i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  }

  nameValueState = value => {
    let name;
    if (this.getLength(value) <= 500) {
      matchWords = value.trim().length;
      name = value;
    } else {
      name = value.slice(0, matchWords);
    }

    this.setState({
      content: name,
    });
  };

  render() {
    const { toUser, status } = this.props;
    return (
      <div>
        <div
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            this.props.goHome();
          }}>
          <img className="toHome" src={require('../../../../../img/find/toHome.png')} />
        </div>
        <div
          className="marketInputshrink"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            if (this.props.loginAlert1()) {
              if (status != 1) {
                showToast('市场已结束，不能评论', 2);
                return;
              }
              this.setState({
                InputExpand: true,
              });
              const marketDetailPage: any = document.getElementById('marketDetailPage');
              marketDetailPage.scrollTop = 0;
              marketDetailPage.style.overflow = 'hidden';
            }

            // document.getElementById('marketDetailPage').style.overflow = "hidden";
            // document.getElementById('marketDetailPage').scrollTop = 0;
          }}>
          <i className="icon-CombinedShapex iconfont" />
        </div>
        {this.state.InputExpand == true ? (
          <div className="InputExpand" id="InputExpand">
            <div
              className="InputExpandMask"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.clearStyle();
                this.setState({
                  InputExpand: false,
                  content: '',
                  optionId: null,
                });
                const marketDetailPage: any = document.getElementById('marketDetailPage');
                marketDetailPage.style.overflow = 'auto';
                // document.getElementById('marketDetailPage').style.overflow = "auto";
              }}
            />
            <div className="InputExpandPage" id="commentInputPageBot">
              <div className="InputPageTop">
                <span
                  className="cancle"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.clearStyle();
                    this.setState({
                      InputExpand: false,
                      content: '',
                      optionId: null,
                    });
                    const marketDetailPage: any = document.getElementById('marketDetailPage');
                    marketDetailPage.style.overflow = 'auto';
                  }}>
                  取消
                </span>
                <span
                  className="launch"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.sendComment();
                  }}>
                  发布
                </span>
              </div>
              <div className="selectOutBox">
                {!this.props.invested ? (
                  <div className="selectOut">
                    <p>选择您支持的选项：</p>
                    <div className="selectBox">
                      {this.props.options.map((val, index) => {
                        let selectNum;
                        if (index == 0) {
                          selectNum = '选项A';
                        }
                        if (index == 1) {
                          selectNum = '选项B';
                        }
                        if (index == 2) {
                          selectNum = '选项C';
                        }
                        if (index == 3) {
                          selectNum = '选项D';
                        }
                        if (index == 4) {
                          selectNum = '选项E';
                        }
                        if (index == 5) {
                          selectNum = '选项F';
                        }
                        // if(this.state.optionId==val.id){
                        //     styleLight=''
                        // }
                        return (
                          <span
                            key={index}
                            className={val.isSelected ? 'select' : 'noSelect'}
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => {
                              this.setOptionId(val.id);
                            }}>
                            {selectNum}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  false
                )}
              </div>
              <div className="commentInputPageBot">
                <textarea
                  placeholder={toUser ? `回复${toUser.creatorName} ：` : '说说我的想法…'}
                  value={this.state.content}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={val => {
                    this.nameValueState(val.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.commentState,
  replayData: store.replyState,
  detailData: store.marketDetailState,
});
withRouter(Input);
export default connect(mapStateToProps)(Input);
