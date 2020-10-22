import React, {Component, Fragment, useEffect, useState} from 'react';
import '../css/components/App.scss';
import Amplify, {Auth, Hub} from 'aws-amplify';
import config from '../aws-exports';
import {Container, Row, Col, NavItem, Nav } from "react-bootstrap";
import Sidebar from './components/Sidebar';
import NavigationBar from './components/NavigationBar';
import { useCurrentBreakpointName } from 'react-socks';
import { FORCE_SIDEBAR_SHOW_BREAKPOINTS } from './Constants';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import VideoPage from './components/VideoPage';

// copied from serviceWorker.js to know if it is localhost or not
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// by default, say it's localhost
const oauth = {
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'http://localhost:3000/',
  redirectSignOut: 'http://localhost:3000/',
  responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
};

// if not, update the URLs
if (!isLocalhost) {
  // TODO: Add these to auth config
  oauth.redirectSignIn = 'https://www.forplusplus.com/';
  oauth.redirectSignOut = 'https://www.forplusplus.com/';
}

// copy the constant config (aws-exports.js) because config is read only.
var configUpdate = config;
// update the configUpdate constant with the good URLs
configUpdate.oauth = {...config.oauth, ...oauth};
// Configure Amplify with configUpdate
Amplify.configure(configUpdate);

const App = () => {
  const [user, updateUser] = useState(null);
  const [customState, updateCustomState] = useState(null);
  const [userPhoto, updateUserPhoto] = useState(null);
  const [userName, updateUserName] = useState(null);
  const [isSidebarVisible, updateIsSidebarVisible] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
          break;
        default:
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  });

  const currentBreakpoint = useCurrentBreakpointName();
  const shouldShowSidebar = isSidebarVisible || FORCE_SIDEBAR_SHOW_BREAKPOINTS.indexOf(currentBreakpoint) !== -1;

  return (
    <Router>
        <Container fluid id="container">
          <Row noGutters>
            <Col noGutters>
              <NavigationBar
                openSidebarCallback={() => updateIsSidebarVisible(!isSidebarVisible)}
                isSidebarVisible={shouldShowSidebar}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={2}>
              <Sidebar isVisible={shouldShowSidebar}/>
            </Col>
            <Col lg={10} onClick={() => updateIsSidebarVisible(false)} id="content-wrapper">
              <Switch>
                <Route path="/courses">
                  <VideoPage heading="No courses yet! Check out this funny video!" videoSrc="https://www.youtube.com/embed/lX1fKrCBjww"/>
                </Route>
                <Route path="/about">ForPlusPlus is a platform that teaches you how to code in 5 minutes or less!</Route>
                <Route path="/contact">Contact ForPlusPlus at forplusplus4@gmail.com</Route>
                <Route path="/">Welcome to ForPlusPlus! More content soon!</Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
  );
}

export default App;
