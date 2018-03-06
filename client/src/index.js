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
import VotingPage from './components/SessionsPage';
import { setJwtToken } from './actions/request';

const middleware = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

setJwtToken(store.getState().user.jwtToken);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="container">
        <Route exact path="/" component={App} />
        <Route path="/sessions" component={VotingPage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
