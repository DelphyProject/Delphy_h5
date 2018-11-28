import React, { Component, MouseEvent } from 'react';
import { Carousel } from 'antd-mobile';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Player } from 'video-react';
import * as fetchData from '../../redux/actions/actions_fetchServerData';
import 'video-react/dist/video-react.css';
import './_slider.less';
import { showToast } from '@/utils/common';

interface SliderProps {
  data: any;
  imgStyle: string;
}

interface SliderState {
  imgHeight: string;
  slideIndex: number;
  isPhoneGap: boolean;
  isImtoken: boolean;
}

type Props = SliderProps & DispatchProp & RouteComponentProps;

class Slider extends Component<Props, SliderState> {
  constructor(props) {
    super(props);
    this.state = {
      imgHeight: '176px',
      slideIndex: 0,
      isPhoneGap: !!parent.isPhoneGap,
      isImtoken: !!window.imToken,
    };

    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  getEscapeActivityDetail(id) {
    this.props.dispatch(
      // @ts-ignore
      fetchData.getCurrentActiveDetail(id, res => {
        if (res.code == 200) {
          if (!res.data) {
            showToast('数据错误', 2);
            return;
          }
          if (!res.data.status) {
            showToast('数据错误', 2);
            return;
          }
          if (!res.data.endTime) {
            showToast('数据错误', 2);
            return;
          }
          if (!res.data.currentTime) {
            showToast('数据错误', 2);
            return;
          }
          switch (res.data.status) {
            case 1:
              if (res.data.endTime > res.data.currentTime) {
                this.props.history.push(`/escape/activity/${id}`);
              } else {
                this.props.history.push(`/escape/activeMarketList/${id}`);
              }
              break;
            case 2:
              this.props.history.push(`/escape/finishPage/h5/${id}`);
              break;
            default:
              break;
          }
        }
      }),
    );
  }

  handleImgClick = (e: MouseEvent<HTMLImageElement>) => {
    const { linkType = '', link = '', marketId } = e.currentTarget.dataset;
    switch (parseInt(linkType, 10)) {
      case 0:
        break;
      case 1:
        if (this.state.isPhoneGap) {
          parent.openLinkInbBrowser(link);
        } else {
          window.location.href = link;
        }
        break;
      case 2:
        this.props.history.push(`/find/topicDetail/${marketId}`);
        break;
      case 3: // 吃鸡活动
        this.getEscapeActivityDetail(marketId);
        // sessionStorage.setItem('from','fromFind')
        // this.props.history.push('/escape/activity/' + val.marketId)
        break;
      default:
        break;
    }
  };

  handleImgLoad = () => {
    this.setState({ imgHeight: 'auto' });
  };

  render() {
    return (
      <div className="sliderOwn">
        <Carousel autoplay={true} infinite={true} selectedIndex={1}>
          {this.props.data.map((val, index) => (
            <div key={index}>
              <div>
                {val.type == 1 ? (
                  <a
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      height: this.state.imgHeight,
                    }}>
                    <img
                      className={this.props.imgStyle}
                      data-link={val.link}
                      data-link-type={val.linkType}
                      data-market-id={val.marketId}
                      onClick={this.handleImgClick}
                      // http://p2dgchwp5.bkt.clouddn.com/447677477670617088?imageView2/1/w/375/h/170
                      src={this.state.isImtoken ? val.url : val.urlPartner || val.url}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={this.handleImgLoad}
                    />
                  </a>
                ) : (
                  false
                )}
                {val.type == 2 ? (
                  <div>
                    {' '}
                    <Player
                      height={170}
                      poster={val.videoImg}
                      playsInline={true}
                      src={val.url}
                      preload="none"
                    />
                  </div>
                ) : (
                  false
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  serverData: store.marketPageState,
});

// @ts-ignore
export default withRouter(connect(mapStateToProps)(Slider));
