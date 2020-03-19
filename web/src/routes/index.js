import React from 'react';
import { Router } from 'react-router-dom';

import history from '~/services/history';
import Route from '~/routes/Route';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import Heroes from '~/pages/Heroes';

export default () => {
  return (
    <Router history={history}>
      <Route path="/" exact guest component={Login} />
      <Route path="/dashboard" privated component={Dashboard} />
      <Route path="/heroes" privated component={Heroes} />
    </Router>
  );
};
