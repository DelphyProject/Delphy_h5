import React from 'react';

import { Route } from 'react-router-dom';
import PurchasePage from '@/scenes/other/buy';
import SellPage from '@/scenes/other/sell';
import TxRecordPage from '@/scenes/findScene/optionTransRecord';
import MarketTxRecordPage from '@/scenes/findScene/marketTxRecord';
import AppealPage from '@/scenes/other/appeal/appeal';

const DetailRouter = ({ match }) => (
  <div>
    <Route exact={true} path={`${match.url}/:id`} component={detail} />
    <Route exact={true} path={`${match.url}/:id/appeal`} component={appeal} />
    <Route exact={true} path={`${match.url}/:id/txRecord`} component={txRecord} />
    <Route exact={true} path={`${match.url}/:id/marketTxRecord`} component={marketTxRecord} />
    <Route exact={true} path={`${match.url}/:id/:optionId/purchase`} component={purchase} />
    <Route exact={true} path={`${match.url}/:id/:optionId/sell`} component={sell} />
  </div>
);

const detail = () => null;
const purchase = ({ match }) => (
  <PurchasePage marketId={match.params.id} optionId={match.params.optionId} />
);
const sell = ({ match }) => (
  <SellPage marketId={match.params.id} optionId={match.params.optionId} />
);
const appeal = ({ match }) => <AppealPage marketId={match.params.id} />;
const txRecord = ({ match }) => <TxRecordPage optionId={match.params.id} />;
const marketTxRecord = ({ match }) => <MarketTxRecordPage marketId={match.params.id} />;
export default DetailRouter;
