import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import { createStore, compose } from 'redux';
import rootReducer from './reducers/rootReducer';
import registerServiceWorker from './registerServiceWorker';

const middleware = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
