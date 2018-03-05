import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import { getCount } from './selectors/user';
import { doSomethingToUser } from './actions/conference';
import { NavLink } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.props.count}
        </p>
        <input type="button" value="click" onClick={() => this.props.dispatch(doSomethingToUser())} />
        <NavLink to="/voting">Voting</NavLink>
      </div>
    );
  }
}

export default connect(
  state => ({
    count: getCount(state)
  })
)(App);
