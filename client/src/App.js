import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';
import { fetchConferences, switchConference } from './actions/conference';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedConference: props.conferenceId,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchConferences());
  }

  render() {
    return (
      <div>
        <h2>Welcome to the BOF manager!</h2>
        <p>Click on a link above to get started.</p>
        <Dropdown fluid selection placeholder="Select a conference" defaultValue={this.props.conferenceId} options={
          this.props.conferences.map(conference => ({ key: conference.id, value: conference.id, text: conference.name }))
        } onChange={(e, data) => this.setState({ selectedConference: data.value })} />
        <br />
        <Button onClick={() => this.props.dispatch(switchConference(this.state.selectedConference))}>
          Switch conference
        </Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
    conferences: state.conference.conferences,
    jwtToken: state.user.jwtToken,
  })
)(App);
