import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from './actions/user';

class App extends Component {
  render() {
    return (
      <div>
        <p>Conference ID: {this.props.conferenceId}</p>
        <p>User Token: {this.props.jwtToken}</p>
        <NavLink to="/sessions">Sessions</NavLink>
        <br />
        <NavLink to="/conferenceadmin">Conference Admin</NavLink>
        <br />
        <NavLink to="/siteadmin">Site Admin</NavLink>
        <br />
        <NavLink to="/schedule">Show Schedule</NavLink>
        <br />
        <a onClick={() => this.props.dispatch(logout())}>Log out</a>
      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
    jwtToken: state.user.jwtToken,
  })
)(App);
