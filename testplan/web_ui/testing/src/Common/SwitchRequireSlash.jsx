import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

export default ({ children = null, location = null }) => (
  <Switch location={location}>
    {/* Must be first - require trailing slash */}
    <Route strict
           exact
           sensitive
           from=':pathNoSlash(|.*?[^/])'
           component={routeProps => (
             <Redirect to={{
               ...routeProps.location,
               pathname: `${routeProps.location.pathname}/`
             }} />
           )}
    />
    {children}
  </Switch>
);
