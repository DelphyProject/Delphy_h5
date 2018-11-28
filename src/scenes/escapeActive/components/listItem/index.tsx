import React from 'react';
import './listItem.less';
import { timestampToTime, survivorRate } from '../../commonjs/time';
interface ListItemProps {
  data: any;
}
interface ListItemState {
  mainArr: Array<any>;
}
class ListItem extends React.Component<ListItemProps, ListItemState> {
  constructor(props) {
    super(props);
    this.state = {
      mainArr: [],
    };
  }

  componentWillReceiveProps(props) {
    const middleArr: Array<any> = [];
    props.data.forEach(item => {
      // if (item.status != 0 && item.status != 100 && item.status != 200) {
      if (item.status == 400) {
        item.options.forEach(pram => {
          if (pram.selected == true) {
            item.survivor = pram.numInvestor;
          }
        });
        middleArr.push(item);
      }
    });
    middleArr.forEach((item, index) => {
      item.itemCode = middleArr.length - index;
    });
    this.setState({
      mainArr: middleArr,
    });
  }

  render() {
    // 渲染每一项活动选项的方法
    const renderOption = optionArr => {
      const list = optionArr.map((item, index) => (
        <p key={index} className={item.selected ? 'select select-true' : 'select'}>
          <i className={item.selected ? 'icon iconfont icon-Group' : 'icon iconfont icon-Group2'} />
          <span className="select-font">{item.title}</span>
          <span className="select-info">
            {item.selected ? `存活${item.numInvestor}人` : `淘汰${item.numInvestor}人`}
          </span>
        </p>
      ));
      return list;
    };

    // 渲染每一项活动的方法
    const rennderItem = (item, index) => (
      <div className="item-warp" key={index}>
        <div className="item-content">
          {item.userStatus == 0 ? (
            <img
              className="img-info"
              src={require('./../../../../img/chicken/img_marketing_list_alive_s.png')}
            /> // 存活
          ) : item.userStatus == -1 ? null : (
            <img
              className="img-info"
              src={require('./../../../../img/chicken/img_marketing_list_out_s.png')}
            />
          ) // 淘汰
          }
          <p className="item-title">
            {item.userStatus == -1 ? null : <span className="space-right" />}
            <span className="space-left">
              {item.itemCode}/{item.marketAmount}
            </span>
            {item.title}
          </p>
          <div className="other-info">
            <i className="icon iconfont icon-Group4" />
            {/* 格式化时间 */}
            <span className="time-font">{timestampToTime(item.endTime)}</span>
            {/* 存活率 */}
            <span className="leave-font">{survivorRate(item.numInvestor, item.survivor)}</span>
          </div>
          <div className="select-box">{renderOption(item.options)}</div>
        </div>
      </div>
    );
    return <div>{this.state.mainArr.map((item, index) => rennderItem(item, index))}</div>;
  }
}

export default ListItem;

/* <p className="select select-true">
                                <i className="icon iconfont icon-Group"></i>
                                <span className="select-font">选项A.不可能</span>
                                <span className="select-info">存活231人</span>
                            </p>
                            <p className="select">
                                <i className="icon iconfont icon-Group2"></i>
                                <span className="select-font">选项B.可以超过</span>
                                <span className="select-info">淘汰231人</span>
                            </p> */

// <div className="item-warp">
//     <div className="item-content">
//         <img className="img-info" src={require('./../../../../img/chicken/img_marketing_list_alive_s.png')} />
//         {/*淘汰img <img className="img-info" src={require('./../../../../img/chicken/img_marketing_list_out_s.png')} /> */}
//         <p className="item-title">
//             <span className="space-right"></span>
//             <span className="space-left">7/10</span>
//             比特币单价在18年6月30日能否超过5万美金？以OKex价格为准
//         </p>
//         <div className="other-info">
//             <i className="icon iconfont icon-Group4"></i>
//             <span className="time-font">
//                 2018-03-20 12:00:00
//             </span>
//             <span className="leave-font">
//                 20%
//             </span>
//         </div>
//         <div className="select-box">
//             <p className="select select-true">
//                 <i className="icon iconfont icon-Group"></i>
//                 <span className="select-font">选项A.不可能</span>
//                 <span className="select-info">存活231人</span>
//             </p>
//             <p className="select">
//                 <i className="icon iconfont icon-Group2"></i>
//                 <span className="select-font">选项B.可以超过</span>
//                 <span className="select-info">淘汰231人</span>
//             </p>
//         </div>
//     </div>
// </div>
