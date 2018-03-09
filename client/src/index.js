import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import App from './App';
import Navbar from './components/Navbar';
import SessionsPage from './components/SessionsPage';
import ConferenceAdminPage from './components/ConferenceAdminPage';
import SiteAdminPage from './components/SiteAdminPage';
import SchedulePage from './components/SchedulePage';
import api from './middleware/api';

import './polyfill';
import LoginRequired from './components/LoginRequired';
import { loadPreviousLoginSession } from './actions/user';

const middleware = compose(
  applyMiddleware(thunk, api),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

store.dispatch(loadPreviousLoginSession());

ReactDOM.render(
  <Provider store={store}>
    <LoginRequired>
      <Router>
        <div>
          <Navbar />
          <div className="container">
            <Route exact path="/" component={App} />
            <Route path="/sessions" component={SessionsPage} />
            <Route path="/conferenceadmin" component={ConferenceAdminPage} />
            <Route path="/siteadmin" component={SiteAdminPage} />
            <Route path="/schedule" component={SchedulePage} />
          </div>
        </div>
      </Router>
    </LoginRequired>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
