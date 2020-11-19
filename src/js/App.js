import React, {useEffect, useState} from 'react';
import '../css/components/App.scss';
import {Container} from "react-bootstrap";
import NavigationBar from './components/NavigationBar';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import CoursePage from './components/coursePage/CoursePage';
import VideoPage from './components/videoPage/VideoPage';
import CoursesPage from './components/CoursesPage';
import Amplify, {Auth, Hub, API, graphqlOperation} from 'aws-amplify';
import config from '../aws-exports';
import { IS_LOCALHOST } from './Constants';
import {connect} from 'react-redux';
import {setUser, addOrUpdateCourses} from './store/actions.js';
import {listCourses} from '../graphql/queries';
import Home from './components/Home';
import Contacts from './components/Contacts';
import About from './components/About';

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

const mapStateToProps = state => {
  const user = state.user || {};
  const adminMode = state.adminMode || false;
  return {user, adminMode};
};

// this needs to be a component as useEffect
// causes too many calls of Auth.currentAuthenticatedUser
const App = ({setUser, addOrUpdateCourses, user, adminMode}) => {

  const getUser = () => {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  const [redirectUri, setRedirectUri] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
        case 'customOAuthState':
          const customState = JSON.parse(data);
          setRedirectUri(customState.redirectTo.pathname);
          break;
        default:
          console.log(event);
          break;
      }
    });

    getUser().then(userData => {
      setUser(userData);
      console.log("This was set");
    });

    API.graphql({...graphqlOperation(listCourses), authMode: 'API_KEY'}).then(response => {
      addOrUpdateCourses(response.data.listCourses.items);
    });
  }, [addOrUpdateCourses, setUser]);

  return (
    <Router>
          {redirectUri && <Redirect to={redirectUri}/>}
          <NavigationBar
            userAttributes={user && user.attributes ? user.attributes : null}
            loginCallback={(redirectTo) => Auth.federatedSignIn({provider: 'Google', customState: JSON.stringify({redirectTo})})}
            logoutCallback={() => Auth.signOut()}
          />
          <Container id="content-wrapper" fluid={adminMode}>
              <Switch>
                <Route path="/course/:courseId/:videoId" component={VideoPage}/>
                <Route path="/course/:courseId" component={CoursePage}/>
                <Route path="/courses"><CoursesPage /></Route>
                <Route path="/about"><About /></Route>
                <Route path="/contact"><Contacts /></Route>
                <Route path="/"><Home /></Route>
              </Switch>
          </Container>
      </Router>
  );
};

export default connect(
  mapStateToProps,
  {setUser, addOrUpdateCourses}
)(App);
