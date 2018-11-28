import React from 'react';
import { Route } from 'react-router-dom';

import FuturePage from '@/scenes/futureScene/futurePage';
import FutureRecord from './historyMarket';

const FindRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={FuturePage} />
    <Route path={`${match.url}/record`} component={FutureRecord} />
  </div>
);

export default FindRouter;
