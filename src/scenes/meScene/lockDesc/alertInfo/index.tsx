import React from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import * as fetchAction from '../../../../redux/actions/actions_fetchServerData';
import './index.less';
interface AlertInfoState {
  isShow: boolean;
}
class AlertInfo extends React.Component<DispatchProp, AlertInfoState> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  componentWillMount() {
    this.hasLockDpy();
  }

  hiddenMask = () => {
    this.setState({
      isShow: false,
    });
  };

  hasLockDpy = () => {
    this.props.dispatch(
      //@ts-ignore
      fetchAction.hasforecast(null, res => {
        if (res.code == 200 && res.data.isDeblocking == true) {
          this.setState({ isShow: true });
        }
      }),
    );
  };

  render() {
    return (
      <div>
        {this.state.isShow ? (
          <div className="alert-info">
            <div className="box-bg-mask" />
            <div className="main-box-info">
              <div className="main-top-box">
                <p className="title-lock">锁定逻辑修改</p>
                <div className="detail-info">
                  <p>
                    DPY锁定逻辑进行调整，原先“解锁额度”逻辑去除。
                    <br />
                    <br />
                    之前未使用的解锁额度，将按照1:1的比例折算成预测币，返到您的账户。
                  </p>
                  <div className="connect-us">
                    <Link to="/me/contact">有疑问？联系我们</Link>
                  </div>
                </div>
              </div>
              <div className="main-bottom-box" onClick={this.hiddenMask}>
                我知道了
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(AlertInfo);
