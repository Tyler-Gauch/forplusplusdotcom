import React, {Suspense, useEffect, useState} from 'react';
import '../css/components/App.scss';
import Amplify, {Auth, Hub} from 'aws-amplify';
import config from '../aws-exports';
import {Container} from "react-bootstrap";
import NavigationBar from './components/NavigationBar';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import CoursePage from './components/CoursePage';
import {COURSES} from '../js/data/Courses';
import VideoPage from './components/VideoPage';
import CoursesPage from './components/CoursesPage';

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

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          updateUser(data);
          break;
        case "signOut":
          updateUser(null );
          break;
        default:
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log("Not signed in"));
  });

  return (
    <Router>
          <NavigationBar
            userAttributes={user && user.attributes ? user.attributes : null}
            loginCallback={() => Auth.federatedSignIn({provider: 'Google'})}
            logoutCallback={() => Auth.signOut()}
          />
          <Container id="content-wrapper">
              <Switch>
                {COURSES.map(course => {
                    return course.videos.map(video => (
                        <Route path={`/course/${course.id}/${video.id}`} key={`${course.id}-${video.id}`}>
                            <Suspense fallback={<div>Loading...</div>}>
                              <VideoPage {...video} />
                            </Suspense>
                        </Route>
                    ));
                })}
                {COURSES.map(course => (
                    <Route path={`/course/${course.id}`} key={course.id}>
                      <CoursePage
                        {...course}
                      />
                    </Route>
                ))}
                <Route path="/courses"><CoursesPage /></Route>
                <Route path="/about">ForPlusPlus is a platform that teaches you how to code in 5 minutes or less!</Route>
                <Route path="/contact">Contact ForPlusPlus at forplusplus4@gmail.com</Route>
                <Route path="/">Welcome to ForPlusPlus! More content soon!</Route>
              </Switch>
          </Container>
      </Router>
  );
}

export default App;
