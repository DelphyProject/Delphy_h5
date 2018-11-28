import React from 'react';
import { Route } from 'react-router-dom';

import Find from '@/scenes/findScene/findPageNew';
import SpecialDetail from '@/scenes/findScene/specialDetail';
import TopicDetail from '@/scenes/findScene/topicDetail';
import NewMarketList from '@/scenes/findScene/newMarketList/newMarketList';
import InnerAssets from '@/scenes/findScene/innerAssets';
import Buy from '@/scenes/findScene/buy';
import Success from '@/scenes/findScene/buy/success/success';
import TeachPage from '@/scenes/findScene/teachPage/teachPage';

const SpecialDetailPage = ({ match }) => <SpecialDetail id={match.params.id} />;
const NewMarketListPage = ({ match }) => <NewMarketList id={match.params.id} />;
const TopicDetailPage = ({ match }) => <TopicDetail marketId={match.params.id} />;
const BuyPage = ({ match }) => <Buy optionId={match.params.id} />;

const innerAssets = () => <InnerAssets />;

const FindRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={Find} />

    <Route path={`${match.url}/newMarketList/:id`} component={NewMarketListPage} />
    <Route path={`${match.url}/specialDetail/:id`} component={SpecialDetailPage} />
    <Route path={`${match.url}/topicDetail/:id`} component={TopicDetailPage} />
    <Route path={`${match.url}/buy/:id`} component={BuyPage} />
    <Route path={`${match.url}/success`} component={Success} />
    <Route path={`${match.url}/innerAssets`} component={innerAssets} />
    <Route path={`${match.url}/teachPage`} component={TeachPage} />
  </div>
);

export default FindRouter;
