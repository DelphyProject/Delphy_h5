function getEnv(key: string, defaultVal: string = '') {
  return process.env[key] || defaultVal;
}

// +------------------------------------------------------------
// |                         常量
// +------------------------------------------------------------
export const channelId = 'COKEWAYS';
export const transferEnabled = false;
export const blockedAllAddsImtoken = true;
export const faucetUrl = 'https://47.91.165.5:28970/';
export const downLoadUrl = 'https://downloads.delphy.org.cn';

// Only works when blockedAllAddsImtoken = false
export const blockedAdsImtoken = ['bitpie', 'mytoken', 'medishares'];

// inviting transfer share icon
export const invitingTransferShareIconUrl = 'https://image.delphy.org.cn/invit_fenxiang.png';

// +------------------------------------------------------------
// |                从系统环境变量读取（CI注入）
// +------------------------------------------------------------
export const clientType = getEnv('REACT_APP_CLIENT_TYPE') || 'h5'; // android：安卓套壳应用，h5：浏览器H5版本

// +------------------------------------------------------------
// |                   从 DOTENV 读取
// +------------------------------------------------------------
export const baseurl = getEnv('REACT_APP_BASE_URL');
export const delphyUrl = getEnv('REACT_APP_DELPHY_URL');
export const searchUrl = getEnv('REACT_APP_SEARCH_URL');
export const socketUrl = getEnv('REACT_APP_SOCKET_URL');
export const tranSocketUrl = getEnv('REACT_APP_TRAN_SOCKET_URL');
export const ethUrl = getEnv('REACT_APP_ETH_URL');
export const network = getEnv('REACT_APP_NETWORK');
export const statisticUrl = getEnv('REACT_APP_STATISTIC_URL');
