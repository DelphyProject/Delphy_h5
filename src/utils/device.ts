const ua = navigator.userAgent;

export const isIpad = /(iPad).*OS\s([\d_]+)/.test(ua);
export const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(ua);
export const isIphone = !isIpod && /(iPhone\sOS)\s([\d_]+)/.test(ua);
export const isIOS = isIphone || isIpad || isIpod;
export const isAndroid = /(Android);?[\s/]+([\d.])?/.test(ua);
export const isWechat = /MicroMessenger/i.test(ua);
