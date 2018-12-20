import * as uid2 from 'uid2';
import * as React from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js';
import './index.less';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './fonts/iconfont.css';
// new VConsole();

if (process.env.NODE_ENV == 'production') {
  Raven.config('https://a171a94faf2c45669580c4c8fbf4464a@sentry.int.cokeway.cn/2').install();
}

if (!localStorage.getItem('__uid__')) {
  localStorage.setItem('__uid__', uid2(64));
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
