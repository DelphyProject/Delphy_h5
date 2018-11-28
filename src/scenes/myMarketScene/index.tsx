import React from 'react';

import { Route } from 'react-router-dom';
import MyMarket from './myMarket';
import Appeal from './appeal/appeal';

const MyMarketRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={MyMarket} />
    <Route exact={true} path={`${match.url}/appeal/:id`} component={AppealPage} />
  </div>
);
const AppealPage = ({ match }) => <Appeal marketId={match.params.id} />;
export default MyMarketRouter;
