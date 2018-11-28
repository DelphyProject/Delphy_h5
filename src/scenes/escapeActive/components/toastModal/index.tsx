import { Modal } from 'antd-mobile';
import './toastModal.less';

const alert = Modal.alert;
export const showAlert = (msg, toIndex, toMarketList, code) => {
  let arr: Array<any> = [{ text: '确定', onPress: () => null }];
  const alertInstance = alert(msg, '', arr);
  if (code == 41024) {
    // 已过报名时间
    arr = [
      { text: '返回首页', onPress: () => toIndex() },
      { text: '去围观', onPress: () => toMarketList() },
    ];
  } else if (code == 41025) {
    // 重复报名
    arr = [{ text: '确定', onPress: () => toMarketList() }];
  } else if (code == 41001) {
    // 余额不足
    arr = [{ text: '确定', onPress: () => false }];
  }
  setTimeout(() => {
    alertInstance.close();
  }, 5000);
};
