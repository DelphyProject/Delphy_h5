const ua = navigator.userAgent;
const safari = /safari/.test(ua);
const standalone = window.navigator['standalone'];

export const isSafari = safari && !standalone;
export const isStandalone = standalone && !isSafari;
export const isIpad = /(iPad).*OS\s([\d_]+)/.test(ua);
export const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(ua);
export const isIphone = !isIpod && /(iPhone\sOS)\s([\d_]+)/.test(ua);
export const isIOS = isIphone || isIpad || isIpod;
export const isAndroid = /(Android);?[\s/]+([\d.])?/.test(ua);
export const isWechat = /MicroMessenger/i.test(ua);
