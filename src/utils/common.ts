import { Toast } from 'antd-mobile';
export const showToast = (msg: string, time: number) => {
  Toast.info(msg, time, undefined, false);
};
export const showLoading = (msg: string) => {
  Toast.loading(msg, 0);
};
export const hideLoading = () => {
  Toast.hide();
};
