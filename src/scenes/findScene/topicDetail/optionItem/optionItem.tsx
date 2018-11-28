import React from 'react';
import { showToast } from '@/utils/common';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './optionItem.less';
interface OptionItemProps {
  banBuy: boolean;
  appeal: any;
  holdOptionId: number;
  data: any;
  apiData: any;
  loginAlert1: any;
  rate: any;
  marketType: number;
}
interface OptionItemState {
  banBuy: boolean;
  expand: boolean;
  buyAble: boolean;
  appeal: boolean;
  isShow: boolean;
}
type Props = OptionItemProps & RouteComponentProps;
class OptionItem extends React.Component<Props, OptionItemState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      banBuy: this.props.banBuy,
      buyAble: false,
      isShow: false,
      appeal: this.props.appeal,
    };
  }

  loginMethod = () => {
    this.setState({
      isShow: true,
    });
  };

  componentWillMount() {
    if (this.props.holdOptionId == null) {
      this.setState({
        buyAble: true,
      });
    } else if (this.props.holdOptionId == this.props.data.id) {
      this.setState({
        buyAble: true,
      });
    } else {
      this.setState({
        buyAble: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      banBuy: nextProps.banBuy,
      appeal: nextProps.appeal,
    });
  }

  render() {
    const buyMethod = val => {
      this.props.history.push(`/find/buy/${val}`);
    };
    return (
      <div className="selectItemBox">
        {this.props.apiData.status == 100 ? (
          <div className="selectTop2100">
            <div className="topBox100">
              <p className="selectTitle"> {this.props.data.title}</p>
              <button
                type="button"
                className={this.state.banBuy || !this.state.buyAble ? 'notLight' : 'light'}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  if (this.props.loginAlert1()) {
                    if (this.state.banBuy) {
                      showToast('市场已结束', 2);
                    } else if (!this.state.buyAble) {
                      showToast('无法同时购买多个选项', 2);
                    } else {
                      buyMethod(this.props.data.id);
                    }
                  }
                }}>
                支持
              </button>
            </div>
            <div className="selectMid">
              <div className="selectItem">
                <i className="img11 icon-Adeltails_ico iconfontMarket" />
                <span className="text12">
                  {this.props.data.price}
                  DPY
                </span>
              </div>
              <div className="selectItem">
                <i className="img11 icon-Adeltails_quantity iconfontMarket" />
                <span className="text12">{this.props.data.totalShares}</span>
              </div>
              <div className="selectItem">
                <i className="img11 icon-Adeltails_amoun iconfontMarket" />
                {/* <span className="text12">{this.props.totalPerson<1? 0:((this.props.data.numInvestor / this.props.totalPerson) * 100).toFixed(0) +'%'}</span> */}
                <span className="text12">{`${this.props.rate}%`}</span>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        {this.props.apiData.status == 200 ? (
          <div className="selectTop2">
            <div className="topBox">
              <p className="selectTitle"> {this.props.data.title}</p>
              {this.props.data.holdShares != 0 ? (
                <div className="holdNums">
                  持有份数：
                  {this.props.data.holdShares}
                </div>
              ) : (
                false
              )}
            </div>
            <div className="selectMid">
              <div className="selectItem">
                <i className="img11 icon-Adeltails_ico iconfontMarket" />
                <span className="text12">
                  {this.props.data.price}
                  DPY
                </span>
              </div>
              <div className="selectItem">
                <i className="img11 icon-Adeltails_quantity iconfontMarket" />
                <span className="text12">{this.props.data.totalShares}</span>
              </div>
              <div className="selectItem">
                <i className="img11 icon-Adeltails_amoun iconfontMarket" />
                {/* <span className="text12">{this.props.totalPerson<1? 0:((this.props.data.numInvestor / this.props.totalPerson) * 100).toFixed(0) +'%'}</span> */}
                <span className="text12">{`${this.props.rate}%`}</span>
              </div>
            </div>
          </div>
        ) : (
          false
        )}
        {this.props.apiData.status == 400 ||
        this.props.apiData.status == 300 ||
        this.props.apiData.status == 250 ? (
          <div>
            {this.props.apiData.rightOption == this.props.data.id ? (
              <div className="selectTop2">
                <div className="topBox">
                  <div className="endTile">
                    <div>
                      <div className="titleBox">
                        <p>
                          <i className="icon-Group iconfont font-green" />{' '}
                          <span className="titleText"> {this.props.data.title}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {this.props.data.holdShares != 0 ? (
                    <div className="holdNums">
                      持有份数：
                      {this.props.data.holdShares}
                    </div>
                  ) : (
                    false
                  )}
                </div>
                <div className="selectMid">
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_ico iconfontMarket" />
                    <span className="text12">
                      {this.props.data.price}
                      DPY
                    </span>
                  </div>
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_quantity iconfontMarket" />
                    <span className="text12">{this.props.data.totalShares}</span>
                  </div>
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_amoun iconfontMarket" />
                    {/* <span className="text12">{this.props.totalPerson<1? 0:((this.props.data.numInvestor / this.props.totalPerson) * 100).toFixed(0) +'%'}</span> */}
                    <span className="text12">{`${this.props.rate}%`}</span>
                  </div>
                </div>
                {this.props.data.id == this.props.apiData.holdOptionId ? (
                  <div className="endStatus">
                    <div className="endProfit">
                      <div className="moneyOut">
                        <p>本次收益</p>
                        <p>+{this.props.apiData.income} DPY</p>
                      </div>
                      <div />
                    </div>
                  </div>
                ) : (
                  false
                )}
              </div>
            ) : (
              <div className="selectTop2">
                <div className="topBox">
                  <div className="endTile">
                    <div>
                      <div className="titleBox">
                        <p>
                          <i className="icon-Group2 iconfont font-orange" />{' '}
                          <span className="titleText">
                            <s> {this.props.data.title}</s>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {this.props.data.holdShares != 0 ? (
                    <div className="holdNums">
                      持有份数：
                      {this.props.data.holdShares}
                    </div>
                  ) : (
                    false
                  )}
                </div>
                <div className="selectMid">
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_ico iconfontMarket" />
                    <span className="text12">
                      {this.props.data.price}
                      DPY
                    </span>
                  </div>
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_quantity iconfontMarket" />
                    <span className="text12">{this.props.data.totalShares}</span>
                  </div>
                  <div className="selectItem">
                    <i className="img11 icon-Adeltails_amoun iconfontMarket" />
                    {/* <span className="text12">{this.props.totalPerson<1? 0:((this.props.data.numInvestor / this.props.totalPerson) * 100).toFixed(0) +'%'}</span> */}
                    <span className="text12">{`${this.props.rate}%`}</span>
                  </div>
                </div>
                {this.props.data.id == this.props.apiData.holdOptionId &&
                this.props.marketType != 4 ? (
                  <div className="endStatus">
                    <div className="endProfitNot">
                      <div className="moneyOut">
                        <p>锁定金额</p>
                        <p>{this.props.apiData.lockMoney} DPY</p>
                      </div>
                      <div>
                        {this.props.apiData.status == 300 || this.props.apiData.status == 250 ? (
                          <div>
                            {this.state.appeal ? (
                              <button type="button" className="orgBtn grayBg">
                                已申诉
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="orgBtn orgBg"
                                // tslint:disable-next-line:jsx-no-lambda
                                onClick={() => {
                                  this.props.history.push(
                                    `/mymarket/appeal/${this.props.apiData.id}`,
                                  );
                                }}>
                                申诉
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="orgBtn orgBg"
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={() => {
                              this.props.history.push('/me/lockdesc');
                            }}>
                            锁定说明
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  false
                )}
              </div>
            )}
          </div>
        ) : (
          false
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  // serverData: store.findPageState,
  serverData: store.marketDetailState,
});
export default connect(mapStateToProps)(withRouter(OptionItem));
