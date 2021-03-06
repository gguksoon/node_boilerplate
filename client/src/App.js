import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import SigninPage from './components/views/SigninPage/SigninPage';
import SignupPage from './components/views/SignupPage/SignupPage';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={LandingPage} />

          <Route exact path="/signin" component={SigninPage} />

          <Route exact path="/signup" component={SignupPage} />
        </Switch>
      </div>
    </Router>
  );
}
 