import dayjs from 'dayjs';

function isUnixTimestamp(t: number): boolean {
  return String(t).length == 10;
}

export const formatTime = (t: number, f?: string): string => {
  const time = isUnixTimestamp(t) ? t * 1000 : t;
  return dayjs(time).format(f || 'YYYY-MM-DD HH:mm:ss');
};

export const timestampToTime = (timestamp: number, state?: number): string => {
  if (state == 2) {
    return formatTime(timestamp, 'HH:mm:ss');
  }
  return formatTime(timestamp);
};

export const getNowTimestamp = (): number => {
  return dayjs().unix();
};
