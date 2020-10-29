import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './js/App';
import { setDefaultBreakpoints, BreakpointProvider } from 'react-socks';
import {BREAKPOINTS} from './js/Constants';
import { Provider as ReduxProvider } from 'react-redux';
import store from './js/store/store.js';

setDefaultBreakpoints(BREAKPOINTS);

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
    <BreakpointProvider>
      <App />
    </BreakpointProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);