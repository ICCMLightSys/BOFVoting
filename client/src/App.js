import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <p>Conference ID: {this.props.conferenceId}</p>
        <NavLink to="/sessions">Sessions</NavLink>
      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
  })
)(App);
