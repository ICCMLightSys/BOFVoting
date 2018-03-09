import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Table } from 'semantic-ui-react';
import { fetchConferences, patchConference } from '../actions/conference';
import { fetchSessions } from '../actions/session';
import { fetchVotes } from '../actions/vote';

class SiteAdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      year: 0,
      iccmEdition: '',
      maxVotes: 0,
    };

    this.handleEditConferenceSubmit = this.handleEditConferenceSubmit.bind(this);
    this.handleEditRoomsSubmit = this.handleEditRoomsSubmit.bind(this);
    this.handleEditRoundsSubmit = this.handleEditRoundsSubmit.bind(this);
  }

  handleEditConferenceSubmit() {
    const { name, year, iccmEdition, maxVotes } = this.state;
    const data = { name, year, iccmEdition, maxVotes };
    this.props.dispatch(patchConference(data));
  }

  handleEditRoomsSubmit(e, data) {
    // const session = { name: this.nameField.value, description: this.descriptionField.value };
    // this.props.dispatch(addSession(session));
    alert('TODO update rooms');
  }

  handleEditRoundsSubmit(e, data) {
    // const session = { name: this.nameField.value, description: this.descriptionField.value };
    // this.props.dispatch(addSession(session));
    alert('TODO update rounds');
  }

  componentDidMount() {
    this.props.dispatch(fetchConferences());
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
  }

  componentWillUpdate(nextProps) {
    if(nextProps.conference !== undefined && this.props.conference === undefined) {
      const { name, year, iccmEdition, maxVotes } = nextProps.conference;
      this.setState({ name, year, iccmEdition, maxVotes });
    }
  }

  render() {
    return (
      <div>
        <h2>Edit Conference</h2>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input ref={nameField => this.nameField = nameField} placeholder="Name" value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })} />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <input type="number" ref={yearField => this.yearField = yearField} placeholder="Year" value={this.state.year}
               onChange={e => this.setState({ year: e.target.value })} />
          </Form.Field>
          <Form.Field>
            <label>ICCM Edition</label>
            <Dropdown
              fluid
              selection
              ref={iccmEditionField => this.iccmEditionField = iccmEditionField}
              placeholder="ICCM Edition"
              options={
                [
                  { key: 'eu', value: 'eu', text: 'Europe' },
                  { key: 'us', value: 'us', text: 'USA' },
                  { key: 'af', value: 'af', text: 'Africa' },
                ]
              }
              value={this.state.iccmEdition}
              onChange={(e, data) => this.setState({ iccmEdition: data.value })} />
          </Form.Field>
          <Form.Field>
            <label>Max Votes</label>
            <input type="number" ref={maxVotesField => this.maxVotesField = maxVotesField} placeholder="Max Votes"
              value={this.state.maxVotes}
              onChange={e => this.setState({ maxVotes: e.target.value })} />
          </Form.Field>
          <Form.Button color="green" type="submit" onClick={this.handleEditConferenceSubmit}>Submit</Form.Button>
        </Form>
        <h2>Rooms</h2>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>Room Number</Table.HeaderCell>
              <Table.HeaderCell>Room Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.rooms.map((room, i) => (
                <Table.Row>
                  <Table.Cell>
                    <Form>
                      <Form.Field>
                        <input type="number" placeholder='#' defaultValue={i + 1} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <input placeholder="Room name" defaultValue={room} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
        <Form>
          <Form.Button color="green" type="submit" onClick={this.handleEditRoomsSubmit}>Submit</Form.Button>
        </Form>
        <h2>Rounds</h2>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>Round Number</Table.HeaderCell>
              <Table.HeaderCell>Round Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.rounds.map((round, i) => (
                <Table.Row>
                  <Table.Cell>
                    <Form>
                      <Form.Field>
                        <input type="number" placeholder='#' defaultValue={i + 1} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <input placeholder="Round name" defaultValue={round} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
        <Form>
          <Form.Button color="green" type="submit" onClick={this.handleEditRoundsSubmit}>Submit</Form.Button>
        </Form>
        <h2>Archive Conference</h2>
        <Form>
          <Form.Field>
            <label>Name: {'Conference Name'}</label>
          </Form.Field>
          <Form.Field>
            <label>Year: {2018}</label>
          </Form.Field>
          <Form.Field>
            <label>Users: {76}</label>
          </Form.Field>
          <Form.Field>
            <label>Sessions: {32}</label>
          </Form.Field>
          <Form.Button color="red" type="submit" onClick={this.handleEditConferenceSubmit}>Archive</Form.Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    conference: state.conference.conferences.find(conference => conference.id === state.conference.conferenceId),
    conferenceId: state.conference.conferenceId,
    rooms: ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'],
    rounds: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'],

  })
)(SiteAdminPage);
