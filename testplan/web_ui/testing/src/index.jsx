import 'bootstrap/dist/css/bootstrap.min.css';
import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';

import { POLL_MS } from './Common/defaults';
import SwitchRequireSlash from './Common/SwitchRequireSlash';
import AppWrapper from './state/AppWrapper';

// Don't make users download scripts that they won't use.
// see: https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
const BatchReport = lazy(() => import('./Report/BatchReport'));
const InteractiveReport = lazy(() => import('./Report/InteractiveReport'));
const EmptyReport = lazy(() => import('./Report/EmptyReport'));
const Home = lazy(() => import('./Common/Home'));

/**
 * This single App provides multiple functions controlled via the URL path
 * accessed. We are using React-Router to control which type of report is
 * rendered and to extract the report UID from the URL when necessary.
 */
const App = () => (
  <AppWrapper>
    <SwitchRequireSlash>
      <Route exact path="/" component={Home} />
      <Route path="/testplan/:uid" render={props =>
           <BatchReport {...props} />
      } />
      <Route path="/interactive/_dev">
        <InteractiveReport dev={true} />
      </Route>
      <Route path="/interactive">
        <InteractiveReport dev={false} poll_ms={POLL_MS} />
      </Route>
      {/* Must be last */}
      <Route component={EmptyReport} />
    </SwitchRequireSlash>
  </AppWrapper>
);

ReactDOM.render(<App/>, document.getElementById('root'));
