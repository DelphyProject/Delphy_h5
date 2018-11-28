import React from 'react';
import './mainBanner.less';
import { timestampToTime } from '../../commonjs/time';
interface MainBannerProps {
  mainData: any;
}
interface MainBannerState {
  bannerData: any;
}
export default class MainBanner extends React.Component<MainBannerProps, MainBannerState> {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: {},
    };
  }

  componentWillReceiveProps(props) {
    props.mainData.forEach(item => {
      let imgArr = [];
      if (item.status == 0 || item.status == 100 || item.status == 200) {
        if (props.mainData[0].image) {
          imgArr = props.mainData[0].image.split(',');
          if (imgArr.length > 1) {
            props.mainData[0].image = imgArr[1];
          } else {
            props.mainData[0].image = imgArr[0];
          }
        }
        this.setState({ bannerData: props.mainData[0] });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="main-banner">
          <div className="main-warp">
            <div className="itemTopBox">
              <span className="setp-num">
                1/
                {this.state.bannerData.marketAmount}
              </span>
              <img className="topicBgImg" src={this.state.bannerData.image} alt="图片" />
              <div className="wraperBox">
                <div className="topicImgMidTitle">{this.state.bannerData.title}</div>
                <div className="topicImgBom">
                  <div className="left">
                    <i className="img1 iconfontMarket icon-Group4" />
                    <span>{timestampToTime(this.state.bannerData.endTime)}</span>
                  </div>
                  <div className="right">
                    <i className="img2 iconfontMarket icon-Adeltails_amoun" />
                    <span>{this.state.bannerData.numInvestor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="second-box">
              <div className="content-box">
                <div className="setp-left">
                  2/
                  {this.state.bannerData.marketAmount}
                </div>
                <img
                  className="lock-img"
                  src={require('./../../../../img/chicken/ic_lock.png')}
                  alt="图片"
                />
              </div>
            </div>
            <div className="third-box">
              <div className="content-box">
                <div className="setp-left">
                  3/
                  {this.state.bannerData.marketAmount}
                </div>
                <img
                  className="lock-img"
                  src={require('./../../../../img/chicken/ic_lock_s.png')}
                  alt="图片"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
