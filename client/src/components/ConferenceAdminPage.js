import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Table } from 'semantic-ui-react';
import { fetchSessions, updateSession } from '../actions/session';
import { fetchVotes } from '../actions/vote';
import AddSession from './AddSession';

class ConferenceAdminPage extends Component {
  constructor(props) {
    super(props);


    this.nameFields = [];
    this.descriptionFields = [];

    this.state = {
      editedSessions: [],
    };

    this.handleChangeTimesSubmit = this.handleChangeTimesSubmit.bind(this);
  }

  handleChangeTimesSubmit(e, data) {
    // const session = { name: this.nameField.value, description: this.descriptionField.value };
    // this.props.dispatch(addSession(session));
    alert('TODO change times');
  }

  componentDidMount() {
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
  }

  render() {
    return (
      <div>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell width="12" singleLine>BOF sessions</Table.HeaderCell>
              <Table.HeaderCell>Save</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.sessions.sort((a, b) => {
                return a.id > b.id ? 1 : -1;
              }).map(({ id, name, votes, facilitators, description }) =>
                <Table.Row key={id}>
                  <Table.Cell>
                    <Form>
                      <Form.Field>
                        <input
                          placeholder='Session name'
                          defaultValue={name}
                          ref={nameField => this.nameFields[id] = nameField}
                          onChange={() => {
                            if(!this.state.editedSessions.includes(id)) {
                              this.setState({ editedSessions: this.state.editedSessions.concat([id]) });
                            }
                          }} />
                      </Form.Field>
                      <p>
                        {`(${votes} votes, ${facilitators} facilitator${facilitators === 1 ? '' : 's'})`}
                      </p>
                      <Form.Field>
                        <textarea
                          placeholder='Session description'
                          defaultValue={description}
                          ref={descriptionField => this.descriptionFields[id] = descriptionField}
                          onChange={() => {
                            if(!this.state.editedSessions.includes(id)) {
                              this.setState({ editedSessions: this.state.editedSessions.concat([id]) });
                            }
                          }} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Button disabled={!this.state.editedSessions.includes(id)} color="green" icon
                        onClick={() => {
                          const editedSessions = [...this.state.editedSessions];
                          editedSessions.splice(editedSessions.indexOf(id), 1);
                          this.setState({ editedSessions });
                          this.props.dispatch(updateSession({
                            id,
                            name: this.nameFields[id].value,
                            description: this.descriptionFields[id].value,
                          }));
                        }}>
                        <Icon name='save' />&nbsp;&nbsp;Save
                      </Form.Button>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Button color="red" icon>
                        <Icon name='trash' />&nbsp;&nbsp;Delete
                      </Form.Button>
                    </Form>
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
        <AddSession />
        <h2>Change Nomination and Voting Times</h2>
        <Form>
          <Form.Field>
            <label>Nomination Start Time</label>
            <input
              ref={nominationStartField => this.nominationStartField = nominationStartField}
              placeholder="Nomination start time" />
          </Form.Field>
          <Form.Field>
            <label>Nomination End Time</label>
            <input
              ref={nominationEndTime => this.nominationEndTime = nominationEndTime}
              placeholder="Nomination end time" />
          </Form.Field>
          <Form.Field>
            <label>Voting Start Time</label>
            <input
              ref={votingStartTime => this.votingStartTime = votingStartTime}
              placeholder="Voting start time" />
          </Form.Field>
          <Form.Field>
            <label>Voting End Time</label>
            <input
              ref={votingEndTime => this.votingEndTime = votingEndTime}
              placeholder="Voting end time" />
          </Form.Field>
          <Form.Button color="green" type="submit" onClick={this.handleChangeTimesSubmit}>Submit</Form.Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    conferenceId: state.conference.conferenceId,
    sessions: state.session.sessions,
    votes: state.vote.votes,
    facilitate: state.facilitate.facilitate,
  })
)(ConferenceAdminPage);
