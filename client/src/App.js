import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to the BOF manager!</h2>
        <p>Click on a link above to get started.</p>
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
