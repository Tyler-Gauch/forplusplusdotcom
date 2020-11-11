import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './js/App';
import { setDefaultBreakpoints, BreakpointProvider } from 'react-socks';
import {BREAKPOINTS} from './js/Constants';
import { Provider as ReduxProvider } from 'react-redux';
import store from './js/store/store.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

setDefaultBreakpoints(BREAKPOINTS);

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
    <BreakpointProvider>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
    </BreakpointProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);