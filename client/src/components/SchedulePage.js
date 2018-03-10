import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'semantic-ui-react';
import { fetchSessions } from '../actions/session';
import { fetchSlots, generateSchedule } from '../actions/slot';
import { fetchConferences } from '../actions/conference';
import { fetchFacilitators } from '../actions/facilitate';
import { fetchUsers } from '../actions/user';

function renderEmptySlot(roomName, i) {
  return (
    <Table.Row key={`empty-${i}`}>
      <Table.Cell>{roomName}</Table.Cell>
      <Table.Cell>No session scheduled</Table.Cell>
      <Table.Cell />
    </Table.Row>
  );
}

function renderLoadingSlot(roomName, i) {
  return (
    <Table.Row key={`empty-${i}`}>
      <Table.Cell>{roomName}</Table.Cell>
      <Table.Cell>Session loading...</Table.Cell>
      <Table.Cell />
    </Table.Row>
  );
}

class SchedulePage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchConferences());
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchSlots(this.props.conferenceId));
    this.props.dispatch(fetchFacilitators());
    this.props.dispatch(fetchUsers());
  }

  renderFacilitators(sessionId) {
    const loadingMessage = 'Loading facilitators...';
    const facilitatorsEntry = this.props.facilitators.find(entry => entry.sessionId === sessionId);

    if (facilitatorsEntry == null) {
      return loadingMessage;
    }

    const facilitators = facilitatorsEntry.facilitators
      .map(userId => this.props.users.find(user => user.id === userId));

    if (facilitators.some(user => user == null)) {
      return loadingMessage;
    }

    if (facilitators.length === 0) {
      return 'None assigned.';
    }

    return facilitators.map(user => user.username).join(', ');
  }

  renderRoom(time, room, i) {
    const slot = this.props.slots.find(slot => slot.timeId === time.id && slot.roomId === room.id);
    if (slot == null) {
      return renderEmptySlot(room.name, i);
    }

    const session = this.props.sessions.find(session => session.id === slot.sessionId);
    if (session == null) {
      return renderLoadingSlot(room.name, i);
    }

    return (
      <Table.Row key={room.id}>
        <Table.Cell>{room.name}</Table.Cell>
        <Table.Cell>{session.name}</Table.Cell>
        <Table.Cell>{this.renderFacilitators(session.id)}</Table.Cell>
      </Table.Row>
    );
  }

  renderTime(time) {
    return (
      <Fragment key={time.id}>
        <h4>{ time.name }</h4>

        <Table>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell textAlign="left" width="2">Location</Table.HeaderCell>
              <Table.HeaderCell textAlign="left" width="10">Session</Table.HeaderCell>
              <Table.HeaderCell textAlign="right" width="4">Facilitator</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { this.props.rooms.map((room, i) => this.renderRoom(time, room, i)) }
          </Table.Body>
        </Table>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <h2>Conference Schedule - {this.props.conferenceName}</h2>
        <Button onClick={() => this.props.dispatch(generateSchedule())}>Generate Schedule</Button>
        { this.props.times.map(this.renderTime.bind(this)) }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { conferenceId, conferences } = state.conference;
  const currentConference = conferences.find(conference => conference.id === conferenceId);

  return {
    conferenceId,
    conferenceName: currentConference ? currentConference.name : 'Loading...',
    times: state.time.filter(time => time.conferenceId === conferenceId),
    rooms: state.room.filter(room => room.conferenceId === conferenceId),
    slots: state.slot.filter(slot => slot.conferenceId === conferenceId),
    sessions: state.session.sessions.filter(session => session.conferenceId === conferenceId),
    facilitators: state.facilitate.facilitators,
    users: state.user.users,
  };
};

export default connect(mapStateToProps)(SchedulePage);
