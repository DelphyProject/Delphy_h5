import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { showToast } from '@/utils/common';
import * as fetchData from '../../../redux/actions/actions_fetchServerData';
import './balance.less';

interface RechargePageProps {
  serverData: any;
}
interface RechargePageState {
  rechargeOuterState: boolean;
  balance: any;
  freeze: any;
  isImtoken: any;
}
type Props = RechargePageProps & DispatchProp & RouteComponentProps;

class RechargePage extends React.Component<Props, RechargePageState> {
  constructor(props) {
    super(props);
    this.state = {
      rechargeOuterState: false,
      balance: sessionStorage.getItem('balance'),
      freeze: sessionStorage.getItem('freeze'),
      isImtoken: !!window.imToken,
    };

    // If the user refreshes on this page. windows.imToken would evaluate to false
    // But it doesn't mean the page is not in imToken browser
    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  componentWillMount() {
    this.props.dispatch(
      //@ts-ignore
      fetchData.balance(result => {
        if (result.code == 200) {
          sessionStorage.setItem('balance', result.data.dpy);
          this.setState({
            balance: result.data.dpy,
            freeze: result.data.dpyFreeze,
          });
        }
      }),
    );
  }

  render() {
    const avatar = require('@/img/coin_dpy.png');
    const useableDPY = (this.state.balance - 0).toFixed(2);
    const freezeDPY = (this.state.freeze - 0).toFixed(2);
    return (
      <div className="balancePage">
        <Helmet>
          <title>余额</title>
        </Helmet>
        <div className="balanceCard">
          <div className="topItem">
            <div className="balanceParent">
              <span className="text_white_14 balanceTip ">可用余额 (DPY)</span>
              <span className="text_white_30 balance">{useableDPY}</span>
            </div>
            <img className="icon" src={avatar} />
          </div>
          <div className="bottomItem">
            <div className="useableDpyParent">
              <span className="text_white_24 balance">{freezeDPY}</span>
              <span className="text_white_14 balanceTip">提现中的金额 (DPY)</span>
            </div>
          </div>
        </div>
        <div className="bottomBalance">
          <div
            className="withdraw"
            onClick={() => {
              // tslint:disable-next-line:jsx-no-lambda
              const myKycLevel = Number(sessionStorage.getItem('kycLevel'));
              const minWithdrawalKyc = Number(sessionStorage.getItem('minWithdrawalKyc'));

              if (minWithdrawalKyc == -1) {
                showToast('该功能暂时停用', 2);
                return;
              }
              if (minWithdrawalKyc > 100) {
                // Hidden restriction
                if (myKycLevel + 100 < minWithdrawalKyc) {
                  showToast('该功能暂时停用', 2);
                  return;
                }
              } else if (myKycLevel < minWithdrawalKyc) {
                showToast('您的KYC等级不足，无法进行此操作', 2);
                return;
              }

              this.props.history.push('/me/withdraw');
            }}>
            <span className="text_black_btn_16 ">提现</span>
          </div>
          <div
            className="recharge"
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              // if (this.state.isImtoken) {
              //     this.props.history.push({
              //         pathname: '/me/recharge/imtoken',
              //         state: {
              //             coinType: 1
              //         }
              //     });
              // } else {
              this.setState({
                rechargeOuterState: true,
              });
              // }
            }}>
            <span className="text_white_16 ">充值</span>
          </div>
        </div>

        {this.state.rechargeOuterState == true ? (
          <div className="rechargeOuter">
            <div
              className="rechargeCover"
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                this.setState({
                  rechargeOuterState: false,
                });
              }}
            />
            <div className="rechargeMode">
              <div className="rechargeModeHead">
                <span
                  className="icon-public_icon_windowclose"
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.setState({
                      rechargeOuterState: false,
                    });
                  }}
                />
                <p>选择充值方式</p>
              </div>
              <div className="rechargeModeinner">
                {/* <Link to="/me/inviting">
                                    <div className="rechargeModeinnerOne">
                                        <dl>
                                            <dt>
                                                <img src={require("@/img/ic_rmb_copy.png")} alt="" />
                                            </dt>
                                            <dd>
                                                <h4>邀请好友转账</h4>
                                            </dd>
                                        </dl><span className="icon-public_narrow_list_more"></span>
                                    </div></Link> */}
                {this.state.isImtoken ? null : (
                  <Link to="/me/exchange">
                    <div className="rechargeModeinnerOne">
                      <dl>
                        <dt>
                          <img src={require('@/img/ic_rmb.png')} alt="" />
                        </dt>
                        <dd>
                          <h4>可信第三方法币兑换</h4>
                        </dd>
                      </dl>
                      <span className="icon-public_narrow_list_more" />
                    </div>
                  </Link>
                )}
                {!this.state.isImtoken ? null : (
                  <div
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.props.history.push({
                        pathname: '/me/recharge/imtoken',
                        state: {
                          coinType: 1,
                        },
                      });
                    }}>
                    <dl>
                      <dt>
                        <img width="36px" height="36px" src={require('@/img/dpy.svg')} alt="" />
                      </dt>
                      <dd>
                        <h4>直接充值DPY代币</h4>
                        <p>DPY是天算平台的唯一数字通证</p>
                      </dd>
                    </dl>
                    <span className="icon-public_narrow_list_more" />
                  </div>
                )}
                {!this.state.isImtoken ? null : (
                  <div
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.props.history.push({
                        pathname: '/me/recharge/imtoken',
                        state: {
                          coinType: 2,
                        },
                      });
                    }}>
                    <dl>
                      <dt>
                        <img width="36px" height="36px" src={require('@/img/eth.svg')} alt="" />
                      </dt>
                      <dd>
                        <h4>充值ETH兑换DPY</h4>
                        <p>ETH将被自动兑换为DPY代币</p>
                      </dd>
                    </dl>
                    <span className="icon-public_narrow_list_more" />
                  </div>
                )}
                {/* {
                                    !this.state.isImtoken ? null :
                                        <div onClick={() => {
                                            this.props.history.push({
                                                pathname: '/me/recharge/imtoken',
                                                state: {
                                                    coinType: 4
                                                }
                                            });
                                        }}>
                                            <dl>
                                                <dt>
                                                    <img width="36px" height="36px" src={usdt} alt="" />
                                                </dt>
                                                <dd>
                                                    <h4>充值USDT兑换DPY</h4>
                                                    <p>充值USDT兑换DPY</p>
                                                </dd>
                                            </dl>
                                            <span className="icon-public_narrow_list_more"></span>
                                        </div>
                                } */}

                {this.state.isImtoken ? null : (
                  <Link to="/me/address">
                    <div>
                      <dl>
                        <dt>
                          <img src={require('@/img/my_img_delphyid.png')} alt="" />
                        </dt>
                        <dd>
                          <h4>直接充值到天算地址</h4>
                          <p>适用于交易所与web端用户</p>
                        </dd>
                      </dl>
                      <span className="icon-public_narrow_list_more" />
                    </div>
                  </Link>
                )}
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
  serverData: store.otherInfoState,
});

export default connect(mapStateToProps)(RechargePage);
