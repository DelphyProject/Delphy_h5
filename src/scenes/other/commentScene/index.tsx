import React from 'react';
import { Route } from 'react-router-dom';
import CommentPage from './pages/commentIndex';
import ReplyPage from './pages/replyPage';
import ImpeachPage from '../impeach/impeach';

const comment = ({ match }) => <CommentPage marketId={match.params.marketid} />;
const reply = ({ match }) => <ReplyPage commentId={match.params.commentid} />;
const impeach = ({ match }) => <ImpeachPage type={match.params.type} id={match.params.id} />;

const CommentRouter = ({ match }) => (
  <div>
    <Route exact={true} path={`${match.url}/:marketid`} component={comment} />
    <Route path={`${match.url}/reply/:commentid`} component={reply} />
    <Route exact={true} path={`${match.url}/:type/:id/impeach`} component={impeach} />
  </div>
);

export default CommentRouter;
