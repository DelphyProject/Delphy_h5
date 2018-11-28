import React from 'react';
import './mainMarketBanner.less';
import { timestampToTime } from '../../commonjs/time';

interface MarketMainBannerProps {
  jumpPage: any;
  data: any;
}
interface MarketMainBannerState {
  isShow: boolean;
  mainData: any;
  games: number;
  isEnd: boolean;
}
export default class MarketMainBanner extends React.Component<
  MarketMainBannerProps,
  MarketMainBannerState
> {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false, // 是否显示样式
      mainData: {}, // 组件数据
      games: 0, // 场次
      isEnd: false, // 总场次
    };
  }

  // 组件接收到数据改变时触发
  componentWillReceiveProps(props) {
    let flag = false;
    if (props.data.length) {
      const arr: Array<any> = [];
      props.data.forEach(item => {
        if (item.status != 0) {
          arr.push(item);
        }
      });
      if (arr.length == props.data[0].marketAmount) {
        this.setState({ isEnd: true });
      }
    }
    // 对传入的数组循环
    props.data.forEach(item => {
      let imgArr;
      // if (item.status == 100 && item.status == 200) {
      if (item.status != 400 && item.status != 0) {
        if (item.image) {
          imgArr = item.image.split(',');
          if (imgArr.length > 1) {
            item.image = imgArr[1];
          } else {
            item.image = imgArr[0];
          }
        }
        flag = true;
        this.setState({
          isShow: true,
          mainData: item,
          games: props.data.length,
        });
        return;
      }
      if (item.status == 0) {
        flag = true;
        this.setState({
          isShow: false,
          mainData: {},
          games: props.data.length,
        });
      }
    });
    if (flag == false) {
      this.setState({
        isShow: false,
        mainData: {},
        games: props.data.length + 1,
      });
    }
  }

  targetPage = () => {
    this.props.jumpPage(this.state.mainData.marketId);
  };

  render() {
    // 渲染选项列表的函数
    const renderOption = optionsArr => {
      const list = optionsArr.map((item, index) => (
        <div key={index} className={item.invested ? 'select-item selected' : 'select-item'}>
          <span className="before-item">{String.fromCharCode(index + 65)}</span>
          <span className="font-item">{item.title}</span>
          <span className="select-info">{item.invested ? '已选择' : null}</span>
        </div>
      ));
      return list;
    };
    return (
      <div>
        <div className="main-banner-box">
          {this.state.isShow ? (
            <div className="activityList" onClick={this.targetPage}>
              <div className="itemTopBox">
                <span className="setp-num">
                  {this.state.games}/{this.state.mainData.marketAmount}
                </span>
                <img className="topicBgImg" src={this.state.mainData.image} alt="图片" />
                <div className="wraperBox">
                  <div className="topicImgMidTitle">{this.state.mainData.title}</div>
                  <div className="topicImgBom">
                    <div className="left">
                      <i className="img1 iconfontMarket icon-Group4" />
                      <span>{timestampToTime(this.state.mainData.endTime)}</span>
                    </div>
                    <div className="right">
                      <i className="img2 iconfontMarket icon-Adeltails_amoun" />
                      <span>{this.state.mainData.survivor}</span>
                    </div>
                  </div>
                </div>
              </div>
              {renderOption(this.state.mainData.options)}
            </div>
          ) : (
            <div className="activityList">
              <div className="none-item">
                {!this.state.isEnd
                  ? `第${this.state.games}场即将开始，敬请期待...`
                  : '活动已结束！'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

/* <div className="select-item selected">
                                    <span className="before-item">A</span>
                                    <span className="font-item">肯定可以</span>
                                    <span className="select-info">已选择</span>
                                </div>
                                <div className="select-item">
                                    <span className="before-item">B</span>
                                    <span className="font-item">肯定不可以</span>
                                    <span className="select-info"></span>
                                </div> */
