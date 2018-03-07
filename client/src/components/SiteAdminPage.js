import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Dropdown, Form, Table } from 'semantic-ui-react';
import { fetchSessions } from '../actions/session';
import { fetchVotes } from '../actions/vote';

class SiteAdminPage extends Component {
  constructor(props) {
    super(props);

    this.handleEditConferenceSubmit = this.handleEditConferenceSubmit.bind(this);
    this.handleEditRoomsSubmit = this.handleEditRoomsSubmit.bind(this);
    this.handleEditRoundsSubmit = this.handleEditRoundsSubmit.bind(this);
  }

  handleEditConferenceSubmit(e, data) {
    // const session = { name: this.nameField.value, description: this.descriptionField.value };
    // this.props.dispatch(addSession(session));
    alert('TODO update conference');
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
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
  }

  render() {
    return (
      <div>
        <h2>Edit Conference</h2>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input ref={nameField => this.nameField = nameField} placeholder="Name" />
          </Form.Field>
          <Form.Field>
            <label>Year</label>
            <input type="number" ref={yearField => this.yearField = yearField} placeholder="Year" />
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
                  { key: 'europe', value: 'europe', text: 'Europe' },
                  { key: 'usa', value: 'usa', text: 'USA' },
                  { key: 'africa', value: 'africa', text: 'Africa' },
                ]
              }/>
          </Form.Field>
          <Form.Field>
            <label>Max Votes</label>
            <input type="number" ref={maxVotesField => this.maxVotesField = maxVotesField} placeholder="Max Votes" />
          </Form.Field>
          <Form.Field>
            <label>Force BOF</label>
            <Checkbox ref={forceField => this.forceField = forceField} />
          </Form.Field>
          <Form.Field>
            <label>BOF Location</label>
            <Dropdown
              fluid
              selection
              ref={locationField => this.locationField = locationField}
              placeholder="BOF Location"
              options={this.props.rooms.map(rooms => ({ key: rooms, value: rooms, text: rooms }))} />
          </Form.Field>
          <Form.Field>
            <label>BOF Round</label>
            <Dropdown
              fluid
              selection
              ref={roundField => this.roundField = roundField}
              placeholder="BOF Round"
              options={this.props.rounds.map(round => ({ key: round, value: round, text: round }))} />
          </Form.Field>
          <Form.Field>
            <label>BOF Title</label>
            <input ref={titleField => this.titleField = titleField} placeholder="BOF Title" />
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
    rooms: ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'],
    rounds: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'],

  })
)(SiteAdminPage);
