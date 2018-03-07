import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <p>Conference ID: {this.props.conferenceId}</p>
        <p>User ID: {this.props.userId}</p>
        <NavLink to="/sessions">Sessions</NavLink>
        <br />
        <NavLink to="/conferenceadmin">Conference Admin</NavLink>
        <br />
        <NavLink to="/siteadmin">Site Admin</NavLink>
      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
    userId: state.user.userId,
  })
)(App);
