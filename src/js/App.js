import React, {Suspense, useEffect} from 'react';
import '../css/components/App.scss';
import {Container} from "react-bootstrap";
import NavigationBar from './components/NavigationBar';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import CoursePage from './components/CoursePage';
import {COURSES} from '../js/data/Courses';
import VideoPage from './components/VideoPage';
import CoursesPage from './components/CoursesPage';
import Amplify, {Auth, Hub, API, graphqlOperation} from 'aws-amplify';
import config from '../aws-exports';
import { IS_LOCALHOST } from './Constants';
import {connect} from 'react-redux';
import {setUser, addCourses} from './store/actions.js';
import {listCourses} from '../graphql/queries';

const initializeAuth = () => {
  // by default, say it's localhost
  const oauth = {
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
  };

  // if not, update the URLs
  if (!IS_LOCALHOST) {
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
}
initializeAuth();

const mapStateToProps = state => {
  const user = state.user || {};
  const courses = state.courses || [];
  return {user, courses};
};

// this needs to be a component as useEffect
// causes too many calls of Auth.currentAuthenticatedUser
const App = ({setUser, addCourses, user, courses}) => {
  const getUser = () => {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case 'cognitoHostedUi':
          getUser().then(userData => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
        default:
          break;
      }
    });

    getUser().then(userData => setUser(userData));

    API.graphql(graphqlOperation(listCourses)).then(response => {
        addCourses(response.data.listCourses.items);
    });
  }, [addCourses, setUser]);

  return (
    <Router>
          <NavigationBar
            userAttributes={user && user.attributes ? user.attributes : null}
            loginCallback={() => Auth.federatedSignIn({provider: 'Google'})}
            logoutCallback={() => Auth.signOut()}
          />
          <Container id="content-wrapper">
              <Switch>
                <Route path="/course/:courseId/:videoId" component={VideoPage}/>
                <Route path="/course/:courseId" component={CoursePage}/>
                <Route path="/courses"><CoursesPage /></Route>
                <Route path="/about">ForPlusPlus is a platform that teaches you how to code in 5 minutes or less!</Route>
                <Route path="/contact">Contact ForPlusPlus at forplusplus4@gmail.com</Route>
                <Route path="/">Welcome to ForPlusPlus! More content soon!</Route>
              </Switch>
          </Container>
      </Router>
  );
};

export default connect(
  mapStateToProps,
  {setUser, addCourses}
)(App);
