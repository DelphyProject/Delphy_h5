// import dayjs from 'dayjs';

// function formatNum(num: number): string {
//   if (num < 0) num = 0;
//   if (num < 10) return `0${num}`;
//   return String(num);
// }

/**
 * @description 根据时间戳算出时间差 格式为'09,59,59'
 * @augments startTime 开始时间
 * @augments endTime 结束时间
 * @returns {hours, minutes, seconds} 时分秒组成的对象
 */
export const countTime = (startTime, endTime) => {
  // const startAt = dayjs(startTime * 1000);
  // const endAt = dayjs(endTime * 1000);
  // const hours = formatNum(endAt.diff(startAt, 'hour'));
  // const minutes = formatNum(endAt.diff(startAt, 'minute'));
  // const seconds = formatNum(endAt.diff(startAt, 'second'));
  // return { hours, minutes, seconds };
  const mss = endTime - startTime;
  let hours: any = parseInt(mss / (1 * 60 * 60 * 1) + '', 10) + '';
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes: any = parseInt((mss % (1 * 60 * 60)) / (1 * 60) + '', 10);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let seconds: any = parseInt((mss % (1 * 60)) / 1 + '', 10);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (mss < 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  return { hours, minutes, seconds };
};

// 格式化时间
export const timestampToTime = timestamp => {
  const date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = `${date.getFullYear()}-`;
  const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  const D = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} `;
  const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
  const m = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`;
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  if (!timestamp) {
    return '00-00-00 00:00:00';
  }
  return Y + M + D + h + m + s;
};

// 计算存活率
export const survivorRate = (total, survivor) => {
  let rate = '';
  if (total == undefined || total == null || isNaN(total)) {
    total = 0;
  }
  if (survivor == undefined || survivor == null || isNaN(survivor)) {
    survivor = 0;
  }
  // 当存活率<10%时，显示两位小数点后两位，如3.45%；当存活率>=10%时，显示小数点后一位
  if (total != 0) {
    (survivor / total) * 100 >= 10
      ? (rate = `${((survivor / total) * 100).toFixed(1)}%`)
      : (rate = `${((survivor / total) * 100).toFixed(2)}%`);
    return rate;
  }
  return '0%';

  // return total == 0 ? '0%' : ((survivor / total) * 100).toFixed(2) + '%';
};

// 将数字格式化（以逗号分隔3位数字）
export const initNum = (num: any) => {
  // 如果传入的数字为null、undefined、NaN则将其置零
  if (num == null || num == undefined || isNaN(num) === true) {
    num = 0;
  }
  const result: any = [];
  let counter = 0;
  num = (num || 0).toString().split('');
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i != 0) {
      result.unshift(',');
    }
  }
  return result.join('');
};
