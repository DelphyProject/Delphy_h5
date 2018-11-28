import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './_loginPage/_loginPage';
import RegisterPage from './_registerPage/_registerPage';
import Agreement from './_agreement/index';
import Privacy from './privacy/privacy';

const LoginRouter = ({ match }) => (
  <div>
    <Route exact={true} path={match.url} component={LoginPage} />
    <Route path={`${match.url}/register`} component={RegisterPage} />
    <Route path={`${match.url}/agreement`} component={Agreement} />
    <Route path={`${match.url}/privacy`} component={Privacy} />
  </div>
);
export default LoginRouter;
// const Login=
