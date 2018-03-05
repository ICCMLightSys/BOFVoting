import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCount } from './selectors/user';
import { NavLink } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <NavLink to="/sessions">Sessions</NavLink>
      </div>
    );
  }
}

export default connect(
  state => ({
    count: getCount(state)
  })
)(App);
