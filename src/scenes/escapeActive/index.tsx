import React from 'react';
import { Route } from 'react-router-dom';
import MainPage from './mianPage/index';
import HistoryResult from './historyResult/historyResult';
import PayPage from './payPage';
import ActiveMarketList from './activeMarketList';
import ActiveDetail from './activeDetail';
import FinishPage from './finishPage/finishPage';
import EscapePreview from './escapePreview';

const EscapeRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={EscapePage} />
    <Route path={`${match.url}/historyResult`} component={HistoryResult} />
    <Route path={`${match.url}/activity/:id`} component={EscapePage} />
    <Route path={`${match.url}/payPage/:id`} component={ActivePayPage} />
    <Route path={`${match.url}/activeMarketList/:id`} component={ActiveMarketListPage} />
    <Route path={`${match.url}/activeDetail/:marketId`} component={ActiveDetailPage} />
    <Route path={`${match.url}/finishPage/h5/:activityId`} component={FinishPage} />
    <Route path={`${match.url}/finishPage/share/:activityId/:Nickname`} component={FinishPage} />
    <Route path={`${match.url}/escapePreview`} component={EscapePreview} />
  </div>
);
const ActiveMarketListPage = ({ match, history }) => (
  <ActiveMarketList id={match.params.id} history={history} />
);
const ActivePayPage = ({ match }) => <PayPage id={match.params.id} />;
const EscapePage = ({ match, history }) => <MainPage id={match.params.id} history={history} />;
const ActiveDetailPage = ({ match }) => <ActiveDetail marketId={match.params.marketId} />;
export default EscapeRouter;
