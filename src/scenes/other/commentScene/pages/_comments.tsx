import React from 'react';
import './styleHotComments.less';
import Comment from '../../../findScene/topicDetail/commentItem/commentItem';
import LoginAlert from '../../../../components/loginAlert/loginAlert';
import { getNowTimestamp } from '@/utils/time';
let loginState;
let effectiveTime;
let nowTime;
interface CommentsProps {
  ClassBordser: any;
  holdOptionId: number;
  data: any;
}
interface ComponentsState {
  banBuy: boolean;
  statusCode: boolean;
  isShow: boolean;
  isShow1: boolean;
}
export default class Comments extends React.Component<CommentsProps, ComponentsState> {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: false,
      banBuy: false,
      isShow: false,
      isShow1: false,
    };
  }

  componentWillMount() {
    loginState = localStorage.getItem('loginState');
    effectiveTime = localStorage.getItem('effectiveTime');
    nowTime = getNowTimestamp();
    const endTime: any = sessionStorage.getItem('endTime');
    let time = endTime - nowTime;
    if (time > 0) {
      setInterval(() => {
        time--;
        if (time < 1) {
          this.setState({
            banBuy: true,
          });
        }
      }, 1000);
    } else {
      this.setState({
        banBuy: true,
      });
    }
  }

  loginAlert1 = () => {
    if (!loginState || !effectiveTime) {
      this.setState({
        isShow: true,
      });
      return false;
    }
    return this.loginAlert2();
  };

  loginAlert2 = () => {
    nowTime = getNowTimestamp();
    if (effectiveTime - nowTime <= 3) {
      this.setState({
        isShow1: true,
      });

      return false;
    }
    return true;
  };

  hideAlert = () => {
    this.setState({
      isShow: false,
      isShow1: false,
    });
  };

  render() {
    return (
      <div className={this.props.ClassBordser}>
        {this.state.isShow ? (
          <LoginAlert info="你尚未登录，请登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {this.state.isShow1 ? (
          <LoginAlert info="账号信息过期，请重新登录" text="去登录" hideAlert={this.hideAlert} />
        ) : (
          false
        )}
        {this.props.data.map((val, index) => (
          // <Comment holdOptionId={this.props.holdOptionId}  data={dataitem} onChoose={this.props.onChoose} />
          <Comment
            holdOptionId={this.props.holdOptionId}
            banBuy={this.state.banBuy}
            key={index}
            typeId={2}
            data={val}
            loginAlert1={this.loginAlert1}
          />
        ))}
        {this.props.data != 0 ? <div className="lineNotMar" /> : false}
      </div>
    );
  }
}
