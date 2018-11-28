import React from 'react';
import { Modal } from 'antd-mobile';
import { connect, DispatchProp } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as fetchData from '../../../../redux/actions/actions_fetchServerData';
import './optionItem.less';
import { showToast } from '@/utils/common';
const alert = Modal.alert;
interface OptionItemProps {
  banBuy: boolean;
  holdOptionId: number;
  data: any;
  clickOption: any;
  loginAlert1: any;
  serverData: any;
}
interface OptionItemState {
  expand: boolean;
  banBuy: boolean;
  buyAble: any;
  isSelect: boolean;
  isShow: boolean;
}
type Props = OptionItemProps & DispatchProp & RouteComponentProps;
class OptionItem extends React.Component<Props, OptionItemState> {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      banBuy: this.props.banBuy,
      buyAble: null,
      isSelect: false,
      isShow: false,
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
        isSelect: true,
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
    });
    if (nextProps.holdOptionId == null) {
      this.setState({
        buyAble: true,
      });
    } else if (nextProps.holdOptionId == nextProps.data.id) {
      this.setState({
        buyAble: true,
        isSelect: true,
      });
    } else {
      this.setState({
        buyAble: false,
      });
    }
  }

  showAlert = (msg, flag, id) => {
    const arr = [
      { text: '取消', onPress: () => false },
      {
        text: '确认',
        onPress: () => {
          this.buyMethod(id);
        },
      },
    ];
    alert(msg, '', arr);
  };

  buyMethod = val => {
    this.props.dispatch(
      //@ts-ignore
      fetchData.buyOption(
        {
          optionId: val,
          amount: 0,
        },
        res => {
          if (res.code != 200) {
            showToast(res.msg, 3);
          } else {
            this.props.clickOption(res);
            showToast('恭喜您，选择成功！', 3);
          }
        },
      ),
    );
  };

  render() {
    return (
      <div className="selectItemBox">
        <div className="selectTop select-height">
          <div className="topBox">
            <p className="selectTitle select-bottom"> {this.props.data.title}</p>
            <button
              type="button"
              className={
                this.state.banBuy || !this.state.buyAble
                  ? 'notLight select-bottom'
                  : 'light select-bottom'
              }
              // tslint:disable-next-line:jsx-no-lambda
              onClick={e => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                if (this.props.loginAlert1()) {
                  if (this.state.banBuy) {
                    showToast('市场已结束', 2);
                  } else if (!this.state.buyAble) {
                    showToast('无法同时购买多个选项', 2);
                  } else if (
                    !this.state.isSelect &&
                    window.localStorage.getItem('token') &&
                    this.props.serverData.marketDetailData.userStatus == 0
                  ) {
                    this.showAlert(
                      `您已选择选项${this.props.data.title},选择后不能修改！`,
                      true,
                      this.props.data.id,
                    );
                  } else {
                    this.buyMethod(this.props.data.id);
                  }
                }
              }}>
              {this.state.isSelect ? '已支持' : '支持'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => ({
  // serverData: store.findPageState,
  serverData: store.marketDetailState,
  optionData: store.escapeOption,
});
export default connect(mapStateToProps)(withRouter(OptionItem));
