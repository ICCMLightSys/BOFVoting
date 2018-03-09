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
import SessionsPage from './components/SessionsPage';
import ConferenceAdminPage from './components/ConferenceAdminPage';
import SiteAdminPage from './components/SiteAdminPage'
import { setJwtToken } from './actions/request';
import api from './middleware/api';

import './polyfill';
import LoginRequired from './components/LoginRequired';

const middleware = compose(
  applyMiddleware(thunk, api),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

setJwtToken(store.getState().user.jwtToken);

ReactDOM.render(
  <Provider store={store}>
    <LoginRequired>
      <Router>
        <div className="container">
          <Route exact path="/" component={App} />
          <Route path="/sessions" component={SessionsPage} />
          <Route path="/conferenceadmin" component={ConferenceAdminPage} />
          <Route path="/siteadmin" component={SiteAdminPage} />
        </div>
      </Router>
    </LoginRequired>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
