import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Helmet } from 'react-helmet';
import { downLoadUrl, delphyUrl, channelId } from '../../config';
import './download.less';
import * as fetchData from '../../redux/actions/actions_fetchServerData';
import { isWechat, isIOS } from '@/utils/device';

interface DownloadState {
  cover: boolean;
  isImtoken: boolean;
}

type Props = DispatchProp;

class Download extends React.Component<Props, DownloadState> {
  constructor(props) {
    super(props);
    this.state = {
      cover: false,
      isImtoken: !!window.imToken,
    };
    window.addEventListener('sdkReady', () => {
      this.setState({ isImtoken: !!window.imToken });
    });
  }

  componentWillMount() {
    if (isWechat) {
      this.setState({
        cover: true,
      });
    }
    if (this.state.isImtoken) {
      this.setState({
        cover: true,
      });
    }
    if (isIOS) this.setState({ cover: isWechat });

    const url = window.location.search;
    const theRequest = {};
    if (url.indexOf('?') != -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      if (theRequest['c']) {
        sessionStorage.setItem('channelId', theRequest['c']);
      } else {
        sessionStorage.setItem('channelId', channelId);
      }
    } else if (!sessionStorage.getItem('channelId')) {
      sessionStorage.setItem('channelId', channelId);
    }
    const statisticId = localStorage.getItem('statisticId');
    if (statisticId) {
      this.addStatistic(40201); // 统计打开
    } else {
      this.getStatisticId();
    }
  }

  getStatisticId = () => {
    this.props.dispatch(
      // @ts-ignore
      fetchData.getStatisticId(ret => {
        if (ret.code == 200) {
          localStorage.setItem('statisticId', ret.data);
          this.addStatistic(40201); // 统计打开
        }
      }),
    );
  };

  addStatistic = actionId => {
    const staId = localStorage.getItem('statisticId');
    const cId = sessionStorage.getItem('channelId');
    if (!staId) return;
    if (!cId) return;
    const phone = localStorage.getItem('username');
    const params = {
      statisticId: staId,
      action: actionId, // 动作编号,后台配置提供
      val1: cId, // 渠道号
      phone: phone || '',
    };
    this.props.dispatch(
      // @ts-ignore
      fetchData.addStatistic(params, ret => {
        //
      }),
    );
  };

  handleIOSDownloadBtnClick = () => {
    location.href = delphyUrl;
  };

  handleAndroidDownloadBtnClick = () => {
    this.addStatistic(40101); // 统计下载
    location.href = `${downLoadUrl}/apollo.delphy.apk`;
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>天算</title>
        </Helmet>
        <div className="download">
          <div className="downLoadLogo clearfix">
            {/* eslint-disable-next-line */}
            <h4 className="iconfont icon-delphy_logo" />
            <div className="downLoadLogoText">
              <p>天 算</p>
              <p>DELPHY</p>
            </div>
          </div>
          <div className="downloadTit">
            <img src={require('../../img/downloadTit.png')} alt="" />
          </div>
          <div className="downloadLogoEdition">
            <p className="iconfont icon-delphy_logo" />
            <h4>Apollo V1.0</h4>
          </div>
          <div className="downloadLogoBtn">
            <p onClick={this.handleIOSDownloadBtnClick}>
              <i className="iconfont icon-delphy_logo" />
              iOS用户请直接使用
            </p>
            <p onClick={this.handleAndroidDownloadBtnClick}>
              <i className="iconfont icon-ic_android" />
              Android客户端下载
            </p>
            <p>iOS 客户端敬请期待</p>
          </div>
        </div>
        {this.state.cover ? (
          <div className="downloadCover">
            <div className="downloadCoverDiv">
              <p>点击右上角的</p>
              <img src={require('../../img/ic_more.png')} alt="" />
            </div>
            <p>选择在浏览器中打开</p>
            <img src={require('../../img/img_arrow.png')} alt="" className="arrow" />
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

export default connect(mapStateToProps)(Download);
