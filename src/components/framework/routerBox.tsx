import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';

import router from './router';

class MyRouter extends Component {
  render() {
    return (
      <Router>
        <Route path="/" component={router} />
      </Router>
    );
  }
}

export default MyRouter;
