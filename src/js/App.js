import React, {Component, Fragment} from 'react';
import '../css/components/App.css';
import Amplify, {Auth, Hub} from 'aws-amplify';
import config from '../aws-exports';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavigationBar from './components/NavigationBar';

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
  oauth.redirectSignIn = 'https://www.forplusplus.com/';
  oauth.redirectSignOut = 'https://www.forplusplus.com/';
}

// copy the constant config (aws-exports.js) because config is read only.
var configUpdate = config;
// update the configUpdate constant with the good URLs
configUpdate.oauth = {...config.oauth, ...oauth};
// Configure Amplify with configUpdate
Amplify.configure(configUpdate);

class App extends Component {
  state = {
    user: null,
    customState: null,
    userPhoto: null,
    userName: null
  };

  componentDidMount() {
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
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;
    console.log(user);

    return (
      <Fragment>
        <Router>
          <NavigationBar
            loginCallback={() => Auth.federatedSignIn({provider: 'Google'})}
            logoutCallback={() => Auth.signOut()}
            userAttributes={user && user.attributes ? user.attributes : null}
          />
        </Router>
      </Fragment>
    );
  }
}

export default App;
