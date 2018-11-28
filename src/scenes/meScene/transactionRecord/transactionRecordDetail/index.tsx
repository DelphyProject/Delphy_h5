import React from 'react';
import './transactionDetailPage.less';
import { connect, DispatchProp } from 'react-redux';
// import { RouteComponentProps } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import TransactionDetail from './_transactionDetail/transactionDetail';
import { ethUrl } from '../../../../config';

interface TransactionDetailPageProps {
  Id: string;
  serverData: any;
}

interface TransactionDetailPageState {
  treeData: any;
  isShow: boolean;
  isShowHelp: boolean;
  isPhoneGap: any;
}

type Props = DispatchProp & TransactionDetailPageProps;
class TransactionDetailPage extends React.Component<Props, TransactionDetailPageState> {
  constructor(props) {
    super(props);
    this.state = {
      treeData: null,
      isShow: false,
      isShowHelp: false,
      isPhoneGap: !!parent.isPhoneGap,
    };
  }

  componentWillMount() {
    this.fetchQuery(Number(this.props.Id) - 0);
    if (this.state.treeData != null) {
      this.setState({
        isShow: true,
      });
    }
  }

  getTreeData(val) {
    this.setState({
      treeData: val.data,
      isShow: true,
    });
  }

  fetchQuery = transId => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.querryTrans(transId, result => {
        if (result.code == 200) {
          // sessionStorage.setItem('isBought',1)

          this.getTreeData(result);
        }
      }),
    );
  };

  helpMethod = e => {
    const aa = document.getElementsByTagName('body')[0];
    aa.setAttribute('color', 'red');
    e.preventDefault();
    this.setState({
      isShowHelp: true,
    });
    return false;
  };

  closeMethod = () => {
    this.setState({
      isShowHelp: false,
    });
  };

  pre = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div>
        {this.state.isShowHelp ? (
          <div
            className="helpAlertOut"
            onClick={this.pre}
            onMouseDown={this.pre}
            onKeyPress={this.pre}
            onScroll={this.pre}>
            <div className="helpAlertBox">
              <div className="helpAlertTop">
                <span />
                <p className="helpAlertTitle">说明</p>
                <span
                  onClick={this.closeMethod}
                  className="iconfontMarket  icon-public_icon_windowcl"
                />
              </div>
              <div className="helpAlertText">
                <p className="textContent">
                  1.为降低您的交易成本，系统会在累积交易达到128笔时，将这128笔交易统一打包上链。
                </p>
                <p className="textContent">
                  2.同时为保证效率，若连续五分钟未凑够128笔交易，我们会将现有交易直接打包上链。
                </p>
                <p className="textContent">3.交易打包信息和上链状态可在此页的Merkle Tree中查看。</p>
              </div>
            </div>
          </div>
        ) : (
          false
        )}

        {this.state.treeData != null ? (
          <div className="treeOutBox">
            <div className="treeTop">
              {Number(this.state.treeData.transType) == 2 ? (
                <p className="treeTitle  inCenter">
                  <span className="add">+</span>
                  <span className="num">{this.state.treeData.cost.toFixed(8)}</span>
                  <span className="unit"> DPY</span>
                </p>
              ) : (
                <span />
              )}
              {Number(this.state.treeData.transType) == 1 ? (
                <p className="treeTitle  inCenter">
                  <span className="add">-</span>
                  <span className="num">{this.state.treeData.cost.toFixed(8)}</span>
                  <span className="unit"> DPY</span>
                </p>
              ) : (
                <span />
              )}
              <span style={{ wordBreak: 'break-word' }} className="adressNumText">
                {this.state.treeData.rootHash}
              </span>
              {/* </div> */}
            </div>
            <div className="packageBox inLeftRight">
              <span className="packageText">区块链前打包</span>
              <span className="packageHelp" onClick={this.helpMethod}>
                ?
              </span>
            </div>
            {this.state.treeData.status == 2 ? (
              <p className="txStatus">交易成功，准备上链</p>
            ) : (
              <span />
            )}
            {this.state.treeData.status == 3 ? (
              <p className="txStatus">
                已经与其它
                {this.state.treeData.txCount - 1}
                笔交易一齐打包上链
              </p>
            ) : (
              <span />
            )}
            <div>
              {this.state.treeData.status == 3 ? (
                <TransactionDetail
                  totalNum={this.state.treeData.txCount}
                  txNum={this.state.treeData.treeOrder}
                  isShow={this.state.treeData.status == 3}
                />
              ) : (
                <TransactionDetail
                  totalNum={60}
                  txNum={this.state.treeData.treeOrder - 1}
                  isShow={false}
                />
              )}
            </div>
            <div className="treeBom">
              {this.state.treeData.status == 2 ? (
                <p className="txInfo  inLeftRight">
                  <span className="infoTitle">区块链交易信息</span>
                  <span className="infoText">状态：等待矿工处理</span>
                </p>
              ) : (
                <span />
              )}
              {this.state.treeData.status == 3 ? (
                <p className="txInfo  inLeftRight">
                  <span className="infoTitle">区块链交易信息</span>
                  <span className="infoText">状态：已上链</span>
                </p>
              ) : (
                <span />
              )}
              {this.state.treeData.status == 3 ? (
                <div>
                  <p className="txMoney inLeftRight">
                    <span className="txMoneyTitle">集中交易总矿工费：</span>
                    <span className="txMoneyText">{this.state.treeData.gasUsed} ETH</span>
                  </p>
                  <p className="txMoney ">
                    <span className="txNumTitle">打包交易号：</span>
                    <span className="txPackageNum">
                      {this.state.isPhoneGap ? (
                        <a
                          // tslint:disable-next-line:jsx-no-lambda
                          onClick={() => {
                            parent.openLinkInbBrowser(ethUrl + this.state.treeData.txHash);
                          }}>
                          {this.state.treeData.txHash}
                        </a>
                      ) : (
                        <a href={ethUrl + this.state.treeData.txHash}>
                          {this.state.treeData.txHash}
                        </a>
                      )}
                    </span>
                  </p>
                </div>
              ) : (
                false
              )}
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.balanceState,
});
export default connect(mapStateToProps)(TransactionDetailPage);
