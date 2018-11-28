import React from 'react';
import { showToast, showLoading, hideLoading } from '@/utils/common';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './kyc2.less';
import { connect, DispatchProp } from 'react-redux';
import * as fetchData from '../../../../../redux/actions/actions_fetchServerData';

interface Kyc2Props {
  serverData: any;
}
interface Kyc2State {
  id: string;
  name: string;
  idFront: any;
  idBack: any;
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

type Props = Kyc2Props & DispatchProp & RouteComponentProps;

class Kyc2 extends React.Component<Props, Kyc2State> {
  idFrontUploader: any;
  idBackUploader: any;
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      idFront: '',
      idBack: '',
    };
  }

  // tslint:disable-next-line:no-empty
  componentDidMount() {}

  thisKyc2 = () => {
    if (!this.state.name || this.state.name.length <= 0) {
      showToast('姓名不能为空', 2);
      return;
    }
    if (!this.state.id || this.state.id.length <= 0) {
      showToast('身份证号不能为空', 2);
      return;
    }
    if (!this.state.idFront || this.state.idFront.length <= 0) {
      showToast('请选择身份证正面照', 2);
      return;
    }
    if (!this.state.idBack || this.state.idBack.length <= 0) {
      showToast('请选择身份证反面照', 2);
      return;
    }
    const params = {
      idFront: this.state.idFront,
      idBack: this.state.idBack,
      id: this.state.id,
      name: this.state.name,
    };
    showLoading('上传中，请稍候');
    this.props.dispatch(
      //@ts-ignore
      fetchData.submitKyc2(params, result => {
        hideLoading();
        if (result.code == 200) {
          showToast('上传成功，请耐心等待审核结果', 2);
          // this.props.history.goBack(-1);
          this.props.history.goBack();
        } else {
          showToast(result.msg, 2);
        }
      }),
    );
  };

  handleOpenIdFront = () => {
    this.idFrontUploader.click();
  };

  handleOpenIdBack = () => {
    this.idBackUploader.click();
  };

  handleIdFrontInput = e => {
    const fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = event => {
      const img = new Image();
      const thisTarget = event.target as FileReaderEventTarget;
      // if (!thisTarget) return;
      img.src = thisTarget.result;
      img.onload = e => {
        this.setState({ idFront: this.compress(e.target, 0.7, 500, 'png') });
      };
    };
  };

  handleIdBackInput = e => {
    const fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = event => {
      const img = new Image();
      const thisTarget = event.target as FileReaderEventTarget;
      // if (!thisTarget) return;
      img.src = thisTarget.result;
      img.onload = e => {
        this.setState({ idBack: this.compress(e.target, 0.7, 500, 'png') });
      };
    };
  };

  compress(sourceImgObj, quality, maxWidth, outputFormat) {
    let mimeType = 'image/jpeg';
    if (typeof outputFormat != 'undefined' && outputFormat == 'png') {
      mimeType = 'image/png';
    }

    maxWidth = maxWidth || 1000;
    let natW = sourceImgObj.naturalWidth;
    let natH = sourceImgObj.naturalHeight;
    const ratio = natH / natW;
    if (natW > maxWidth) {
      natW = maxWidth;
      natH = ratio * maxWidth;
    }

    const cvs = document.createElement('canvas');
    cvs.width = natW;
    cvs.height = natH;
    const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
    // if (!ctx) return;
    ctx.drawImage(sourceImgObj, 0, 0, natW, natH);
    const newImageData = cvs.toDataURL(mimeType, quality / 100);
    return newImageData;
  }

  render() {
    return (
      <div className="kyc2Page">
        <div className="kyc2Top">
          <div className="kycName kyc">
            <p>姓名</p>
            <input
              type="text"
              placeholder="请输入姓名"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={val => {
                this.setState({
                  name: val.target.value,
                });
              }}
              value={this.state.name}
            />
          </div>
          <div className="kycCertificates kyc">
            <p>证件号</p>
            <input
              type="text"
              placeholder="请输入证件号码"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={val => {
                this.setState({
                  id: val.target.value,
                });
              }}
              value={this.state.id}
            />
          </div>
        </div>
        <div className="kyc2Bottom">
          <div className="idCard idPositive" onClick={this.handleOpenIdFront}>
            <h4>身份证正面</h4>
            <img src={this.state.idFront ? this.state.idFront : ''} alt="" />
            {this.state.idFront ? null : <p>点击添加证件照片</p>}
            <input
              type="file"
              ref={idFrontUploader => {
                this.idFrontUploader = idFrontUploader;
              }}
              style={{ display: 'none' }}
              onChange={this.handleIdFrontInput}
            />
          </div>
          <div className="idCard idOther" onClick={this.handleOpenIdBack}>
            <h4>身份证反面</h4>
            <img src={this.state.idBack ? this.state.idBack : ''} alt="" />
            {this.state.idBack ? null : <p>点击添加证件照片</p>}
            <input
              type="file"
              ref={idBackUploader => {
                this.idBackUploader = idBackUploader;
              }}
              style={{ display: 'none' }}
              onChange={this.handleIdBackInput}
            />
          </div>
          <div className="kycDescribe">
            <p>1.您提供的身份信息Delphy将予以加密保护，保证此证件照片仅用于Delphy身份认证。</p>
            <p>
              2.请尽量保证证件填充满整张图片，避免出现证件变形、模糊、及除证件以外的其它内容入镜，否则证件信息将无法通过审核。
            </p>
          </div>
          <input type="button" className="kycBtn" value="认证" onClick={this.thisKyc2} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  serverData: store.loginUserState,
});

export default connect(mapStateToProps)(withRouter(Kyc2));
