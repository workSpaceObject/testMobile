import React from 'react';
import { Router, Route } from 'dva/router';

 import EventPage from './EventPage';
import MainPage from './MainPage';
 import ExaminePage from './ExaminePage';
import LoginPage from './LoginPage';
import TestWaitPage from './TestWaitPage';
import TestingPage from './TestingPage';
import  SelectTestPage from './SelectTestPage';
 import HelpEventPage from './HelpEventPage';
import EventWaitPage from './EventWaitPage'
import LeaveWaitPage from './LeaveWaitPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
       <Route path="/" component={LoginPage} />
      <Route component={MainPage}>
        <Route path="/helpEvent" component={HelpEventPage} />
        <Route path="/select" component={SelectTestPage} />
        <Route path="/eventWait" component={EventWaitPage} />
        <Route path="/testing" component={TestingPage} />
        <Route path="/leaveWait" component={LeaveWaitPage} />
        <Route path="/event" component={EventPage} />
        <Route path="/testWait" component={TestWaitPage} />
      </Route>
      <Route path="/examin" component={ExaminePage} />
    </Router>
  );
}

export default RouterConfig;
