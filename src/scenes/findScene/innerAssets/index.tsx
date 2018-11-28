import React from 'react';
import { withRouter } from 'react-router-dom';
import { showToast } from '@/utils/common';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as fetchData from '@/redux/actions/actions_fetchServerData';
import './innerAssets.less';

interface XinnerAssetsState {
  phone: string;
  address: string;
}
class XinnerAssets extends React.Component<DispatchProp, XinnerAssetsState> {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      address: '',
    };
  }

  componentWillMount() {
    const that = this;
    if (window.imToken) {
      that.setAddress();
    } else {
      window.addEventListener('sdkReady', () => {
        if (window.imToken) {
          that.setAddress();
        }
      });
    }
  }

  setAddress() {
    const that = this;
    //@ts-ignore
    imToken.callAPI('user.getCurrentAccount', (err, address) => {
      if (err) {
        showToast(err, 2);
      } else {
        that.setState({ address });
      }
    });
  }

  dealClick() {
    if (!window.imToken) {
      showToast('此功能只适用于imtoken浏览器', 2);
      return;
    }
    // this.setState({address: '0x3648c87fd51E6Aa4F0C5F2DB1b5cc7cef0E7Cff4'})
    if (!this.state.phone || this.state.phone.length <= 0) {
      showToast('手机号不能为空', 2);
      return;
    }
    const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(this.state.phone)) {
      showToast('手机号码格式不正确', 2);
      return;
    }
    this.isRecord();
  }

  isRecord() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchIsRecord({ phone: localStorage.getItem('username') }, ret => {
        if (ret.code == 200) {
          if (ret.data) {
            showToast('你已经领取过测试币了，请勿重复领取', 2);
          } else {
            this.faucet();
          }
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  faucet() {
    const p = 'dpy=100';
    this.props.dispatch(
      //@ts-ignore
      fetchData.faucet(this.state.address, p, ret => {
        if (ret.code == 0) {
          this.record();
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  record() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.fetchRecord({ phone: localStorage.getItem('username') }, ret => {
        if (ret.code == 200) {
          showToast('提交成功测试币到账需要花费一定时间，请耐心等待', 2);
        } else {
          showToast(ret.msg, 2);
        }
      }),
    );
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>领币</title>
        </Helmet>
        <div className="innerAssets">
          <div className="innerAssetsBanner">
            <img src={require('../../../img/innerAssets/innerAssetsBanner.png')} alt="" />
          </div>
          <div className="innerAssetsBody">
            <p className="innerAssetsPro">
              尊敬的天算内测用户，我们已开放内测版充值功能的测试，为保证您使用顺畅，我们在此提供了测试币领取方式，在下方输入框内填写内测的注册账号点击领取按钮即可。
            </p>
            <pre className="innerAssetsStar">
              <img src={require('../../../img/innerAssets/innerAssetsStar.png')} alt="" />
            </pre>
            <p className="innerAssetsPro2">
              请仔细阅读下方注意事项！以免给您带来不必要的财产损失。
            </p>
            <div className="innerAssetsProgram innerAssetsProgram1">
              <pre>1</pre>
              <p>用户可在此领取的0.5个ETH和500DPY，每个用户只能领取一次。</p>
            </div>
            <div className="innerAssetsProgram innerAssetsProgram2">
              <pre>2</pre>
              <p>
                测试币会直接打到测试版imToken中，请在钱包中添加好对应的资产（选择有图标的DPY）。使用天算H5内测版本时可提前通过领取的测试币进行充值。
              </p>
              <img src={require('../../../img/innerAssets/innerAssetsImg.png')} alt="" />
            </div>
            <div className="innerAssetsProgram innerAssetsProgram3">
              <pre>3</pre>
              <p>
                内测币是在以太坊测试链上的代币，仅能用于内测版本生成的地址上充值提现，并无实际价值。测试币和真实代币属于两条链上的东西，请勿将测试币进行提现充值到您已有的真实地址。
              </p>
            </div>
            <p className="innerAssetsPro3">*本活动最终解释权归天算团队所有*</p>
          </div>
          <div className="innerAssetsFoot">
            <input
              className="innerAssetsT"
              type="text"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={e => {
                this.setState({
                  phone: e.target.value,
                });
              }}
              placeholder="输入您绑定的内测手机号"
            />
            <input
              className="innerAssetsB"
              type="button"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.dealClick();
              }}
              value="领取"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({ s1: '' });
const innerAssets = withRouter(XinnerAssets);

export default connect(mapStateToProps)(innerAssets);
