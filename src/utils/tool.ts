import { showToast } from '@/utils/common';
import { getNowTimestamp } from '@/utils/time';

export const isLogin = (showDialog: boolean) => {
  const loginState = localStorage.getItem('loginState');
  const effectiveTime = localStorage.getItem('effectiveTime');
  if (!loginState || !effectiveTime) {
    if (showDialog) {
      showToast('请登录', 2);
    }
    return false;
  }

  const nowTime = getNowTimestamp();
  if (parseInt(effectiveTime, 10) - nowTime <= 3) {
    if (showDialog) {
      showToast('账号信息过期，请重新登录', 2);
    }

    return false;
  }

  return true;
};
