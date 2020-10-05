import React, {Component} from 'react';
import './App.css';
import Amplify, {Auth, Hub} from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

class App extends Component {
  state = { user: null, customState: null };

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

    return (
      <div className="App">
        <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
        {user && <button onClick={() => Auth.signOut()}>Sign Out {user.attributes.email}</button>}
      </div>
    );
  }
}

export default App;
