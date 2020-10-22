import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './js/App';
import { setDefaultBreakpoints, BreakpointProvider } from 'react-socks';
import {BREAKPOINTS} from './js/Constants';

setDefaultBreakpoints(BREAKPOINTS);

ReactDOM.render(
  <React.StrictMode>
    <BreakpointProvider>
      <App />
    </BreakpointProvider>
  </React.StrictMode>,
  document.getElementById('root')
);