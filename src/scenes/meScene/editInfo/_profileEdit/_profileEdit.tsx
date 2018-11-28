import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './profileEdit.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import webViewApi from '../../../../webViewerApi';
import { showToast, showLoading, hideLoading } from '@/utils/common';

interface InfoEditProps {
  serverData: any;
  nickname: string;
  description: string;
  avatar: any;
}
interface InfoEditState {
  name: string;
  describe: string;
  avatar: any;
}
interface ThisWindow extends Window {
  onPickImage: any;
}
type Props = InfoEditProps & DispatchProp & RouteComponentProps;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
let matchWords = 0;
class InfoEdit extends React.Component<Props, InfoEditState> {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.nickname ? this.props.nickname : '',
      describe: this.props.description ? this.props.description : '',
      avatar: this.props.avatar ? this.props.avatar : require('@/img/my_photo_none.png'),
    };
  }

  componentDidMount() {
    const thiswindows = window as ThisWindow;
    thiswindows.onPickImage = base64Data => {
      this._updateAvatar(base64Data);
    };
  }

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
    if (this.getLength(value) <= 20) {
      matchWords = value.trim().length;
      name = value;
    } else {
      name = value.slice(0, matchWords);
    }

    this.setState({
      name,
    });
  };

  describeValueState = value => {
    let desc;
    if (this.getLength(value) <= 80) {
      matchWords = value.trim().length;
      desc = value;
    } else {
      desc = value.slice(0, matchWords);
    }
    this.setState({
      describe: desc,
    });
  };

  upDataEvent = () => {
    const params = {
      nickname: this.state.name,
      description: this.state.describe,
    };
    this.props.dispatch(
      //@ts-ignore
      fetchData.upDataMyInfo(params, ret => {
        if (ret.code == 200) {
          showToast('修改成功', 2);
          const fromRegister = sessionStorage.getItem('fromRegister');
          if (!fromRegister) return;
          if (fromRegister == '1') {
            sessionStorage.removeItem('fromRegister');
            this.props.history.push('/me');
          } else {
            this.props.history.goBack();
          }
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  };

  _updateAvatar(val) {
    const params = {
      avatar: val,
    };
    showLoading('loading');
    this.props.dispatch(
      //@ts-ignore
      fetchData.updateMyIcon(params, ret => {
        let time = 0;
        const int = setInterval(() => {
          time++;

          if (time == 10) {
            hideLoading();
            showToast('头像修改失败', 2);
            clearInterval(int);
          }
        }, 1000);
        if (ret.code == 200) {
          clearInterval(int);
          this.setState({
            avatar: ret.data,
          });
          showToast('头像修改成功', 2);
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  handleChange = info => {
    if (info.target.files[0] != undefined) {
      getBase64(info.target.files[0], imageUrl => {
        this._updateAvatar(imageUrl);
      });
    }
  };

  render() {
    const isImToken = localStorage.getItem('platform');
    let avatar;
    if (this.state.avatar) {
      if (this.state.avatar.indexOf('.bkt') > 0) {
        avatar = `${this.state.avatar}?imageView2/1/w/100/h/100`;
      } else {
        avatar = this.state.avatar;
      }
    } else {
      avatar = require('@/img/my_photo_none.png');
    }
    return (
      <div className="profileEditPage">
        <form action="">
          <div className="profileEdit">
            {' '}
            {window.delphy || isImToken == 'imtoken' ? (
              <div className="settingHeadImg">
                <img
                  src={avatar}
                  alt=""
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    if (window.delphy) {
                      window.delphy.chooseImage();
                    } else {
                      webViewApi.selectPicture(base64 => {
                        this._updateAvatar(base64);
                      });
                    }
                  }}
                />{' '}
              </div>
            ) : (
              <div className="myIcon">
                {' '}
                <input
                  type="file"
                  className="uploadImg"
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={e => {
                    this.handleChange(e);
                  }}
                  accept="image/*"
                />
                <img src={avatar} alt="" />
              </div>
            )}{' '}
            <textarea
              className="input"
              placeholder="昵称（20个字符或10个汉字）"
              defaultValue={this.props.nickname}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={va => {
                this.nameValueState(va.target.value);
              }}
            />{' '}
            <textarea
              name=""
              id=""
              placeholder="个人介绍（80个字符或40个汉字）"
              cols={30}
              rows={3}
              // defaultValue={this.state.describe}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={va => {
                this.describeValueState(va.target.value);
              }}>
              {this.state.describe}
            </textarea>{' '}
            <pre onClick={this.upDataEvent}> 保存 </pre>{' '}
          </div>{' '}
        </form>{' '}
      </div>
    );
  }
}
const mapStateToProps = store => ({ serverData: store.updataMyInfo });
const ProfileEdit = withRouter(InfoEdit);
export default connect(mapStateToProps)(ProfileEdit);
