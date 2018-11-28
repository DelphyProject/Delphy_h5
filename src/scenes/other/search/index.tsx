import React from 'react';
import { Route } from 'react-router-dom';
import search from './_searchPage/_searchPage';

const searchRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={search} />
  </div>
);
export default searchRouter;
