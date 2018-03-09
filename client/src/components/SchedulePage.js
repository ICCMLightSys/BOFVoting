import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Dropdown, Form, Table } from 'semantic-ui-react';
import { fetchSessions } from '../actions/session';
import { fetchSlots } from '../actions/slot';
import { fetchConferences, receiveConference } from '../actions/conference';

class SchedulePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(fetchConferences());
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchSlots(this.props.conferenceId));
  }

  render() {
    return (
      <div>
        <h2>Conference Schedule</h2>
          {this.props.conferences.find(conference => {return conference.id == this.props.conferenceId}).name}
        <Table>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell textAlign="left">Location</Table.HeaderCell>
              <Table.HeaderCell textAlign="left">Session</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Facilitator</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.sessions.map((slots, i) => (
                <Table.Row>
                  <Table.Cell textAlign="left">
                    Location
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    **Session**
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    **Facilitator**
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>

      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
    conferenceName: state.conference.conferences.find(),
    sessions: state.session.sessions,
    facilitate: state.facilitate.facilitate,
    slots: state.slot.slot,
    times: state.time.time,
    rooms: state.room.room,
  })
)(SchedulePage);
