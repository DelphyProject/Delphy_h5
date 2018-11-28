import React from 'react';
import './alertBox.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
interface AlertBoxProps {
  isHidden: boolean;
  data: any;
  typeID: number;
  callback: any;
  marketId: number;
}
type Props = AlertBoxProps & RouteComponentProps;
class AlertBox extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: this.props.isHidden,
    };
  }

  render() {
    const { history, data } = this.props;
    return (
      <div>
        {this.props.isHidden == false ? (
          <div />
        ) : (
          <div className="alertBoxOut">
            {this.props.typeID == 0 ? (
              <div className="alertBox">
                <div className="alertBoxTop">
                  <div
                    className="closeBox"
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.props.callback(this.props.isHidden);
                    }}>
                    <span className="icon-public_icon_windowclose close_icon" />
                  </div>
                  <p className="close_text">选择要买入的项</p>
                  <div className="closeBox">
                    <span
                      className="icon-public_icon_windowclose close_icon"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>
                <div className="alertBoxBom">
                  {data.options.map((val, index) => (
                    // <Link key={val.id} to={{path:`/market/${val.uniqueId}/${val.uniqueId}/purchase`,state:val}} >
                    <div
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        // <Link key={val.id} to={{pathname:`/market/${val.id}/${val.id}/sell`,state:this.props.data}} >
                        sessionStorage.setItem('markets', JSON.stringify(data.options));
                        sessionStorage.setItem('marketItem', JSON.stringify(val));
                        sessionStorage.setItem('lossLimit', data.lossLimit);
                        sessionStorage.setItem('eventTitle', data.title);
                        history.push({
                          pathname: `/market/${this.props.marketId}/${val.id}/purchase`,
                          state: data,
                        });
                        // history.push(`/market/${val.id}/${val.id}/purchase`,state:val)
                      }}
                      key={index}
                      className="selectItem"
                      id={val.id}>
                      <span>{val.title}</span>
                      <pre className="icon-public_icon_back_normal" />
                    </div>
                    // </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="alertBox">
                <div className="alertBoxTop">
                  <div
                    className="closeBox"
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => {
                      this.props.callback(this.props.isHidden);
                    }}>
                    <span className="icon-public_icon_windowclose close_icon" />
                  </div>
                  <p className="close_text">选择要卖出的项</p>
                  <p />
                </div>
                <div className="alertBoxBom">
                  {data.options.map(val => (
                    // <Link key={val.id} to={{path:`/market/${val.uniqueId}/${val.uniqueId}/purchase`,state:val}} >
                    <div
                      // tslint:disable-next-line:jsx-no-lambda
                      onClick={() => {
                        if (val.holdShares <= 0) {
                          return;
                        }
                        // <Link key={val.id} to={{pathname:`/market/${val.id}/${val.id}/sell`,state:this.props.data}} >
                        sessionStorage.setItem('markets', JSON.stringify(data.options));
                        sessionStorage.setItem('marketItem', JSON.stringify(val));
                        sessionStorage.setItem('lossLimit', data.lossLimit);
                        sessionStorage.setItem('eventTitle', data.title);
                        history.push({
                          pathname: `/market/${this.props.marketId}/${val.id}/sell`,
                          state: data,
                        });
                        // history.push(`/market/${val.id}/${val.id}/purchase`,state:val)
                      }}
                      className={val.holdShares > 0 ? 'selectItem' : 'unselectItem'}
                      //   url={`/market/${this.props.marketId}/3345/purchase`}
                      id={val.id}>
                      {val.title}
                    </div>
                    // </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(AlertBox);
