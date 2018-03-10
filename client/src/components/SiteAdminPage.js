import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Icon, Table } from 'semantic-ui-react';
import { fetchConferences, patchConference } from '../actions/conference';
import { fetchSessions } from '../actions/session';
import { fetchVotes } from '../actions/vote';
import { addRoom, fetchRooms } from '../actions/room';
import { addTime, fetchTimes } from '../actions/time';

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
  }

  handleEditConferenceSubmit() {
    const { name, year, iccmEdition, maxVotes } = this.state;
    const data = { name, year, iccmEdition, maxVotes };
    this.props.dispatch(patchConference(data));
  }

  componentDidMount() {
    this.props.dispatch(fetchConferences());
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
    this.props.dispatch(fetchRooms(this.props.conferenceId));
    this.props.dispatch(fetchTimes(this.props.conferenceId));
    if(this.props.conference !== undefined) {
      const { name, year, iccmEdition, maxVotes } = this.props.conference;
      this.setState({ name, year, iccmEdition, maxVotes });
    }
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
              <Table.HeaderCell>Room Name</Table.HeaderCell>
              <Table.HeaderCell>Save</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.rooms.map(room => (
                <Table.Row key={room.id}>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <input placeholder="Room name" defaultValue={room.name} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <Form.Button color="green" icon onClick={() => alert('TODO save')}>
                          <Icon name='save'/>&nbsp;&nbsp;Save
                        </Form.Button>
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <Form.Button color="red" icon onClick={() => alert('TODO delete')}>
                          <Icon name='trash'/>&nbsp;&nbsp;Delete
                        </Form.Button>
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
        <div className="add-room-and-rounds-container">
          <Form.Input className="add-room-and-rounds-textbox" placeholder="Enter a room name"
            onChange={(e, data) => {
              this.setState({ newRoomField: data.value });
            }} />
          <Form.Button color="green" type="submit" onClick={() => {
            this.props.dispatch(addRoom(this.state.newRoomField));
            this.setState({ newRoomField: '' });
          }}>
            <Icon name='plus'/>&nbsp;&nbsp;Add
          </Form.Button>
        </div>
        <h2>Rounds</h2>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>Round Number</Table.HeaderCell>
              <Table.HeaderCell>Round Name</Table.HeaderCell>
              <Table.HeaderCell>Save</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.rounds.map(round => (
                <Table.Row key={round.id}>
                  <Table.Cell>
                    <Form>
                      <Form.Field>
                        <input type="number" placeholder='#' defaultValue={round.idx} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <input placeholder="Round name" defaultValue={round.name} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <Form.Button color="green" icon onClick={() => alert('TODO save')}>
                          <Icon name='save'/>&nbsp;&nbsp;Save
                        </Form.Button>
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Field>
                        <Form.Button color="red" icon onClick={() => alert('TODO delete')}>
                          <Icon name='trash'/>&nbsp;&nbsp;Delete
                        </Form.Button>
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
        <div className="add-room-and-rounds-container">
          <Form.Input type="number" className="add-room-and-rounds-textbox" placeholder="Enter a round number"
            onChange={(e, data) => {
              this.setState({ newRoundNumberField: data.value });
            }} />
          <Form.Input className="add-room-and-rounds-textbox" placeholder="Enter a round name"
            onChange={(e, data) => {
              this.setState({ newRoundNameField: data.value });
            }} />
          <Form.Button color="green" type="submit" onClick={() => {
            this.props.dispatch(addTime(this.state.newRoundNameField, parseInt(this.state.newRoundNumberField)));
            this.setState({ newRoundNameField: '', newRoundNumberField: 0 });
          }}>
            <Icon name='plus'/>&nbsp;&nbsp;Add
          </Form.Button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    conference: state.conference.conferences.find(conference => conference.id === state.conference.conferenceId),
    conferenceId: state.conference.conferenceId,
    rooms: state.room,
    rounds: state.time,
  })
)(SiteAdminPage);
