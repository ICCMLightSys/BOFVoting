import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Table } from 'semantic-ui-react';
import { addSession, fetchSessions } from '../actions/session';
import { fetchVotes } from '../actions/vote';
import { fetchFacilitates } from '../actions/facilitate';
import AddSession from './AddSession';

class SessionsPage extends Component {
  constructor(props) {
    super(props);

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
              this.props.sessions.map(({ id, name, numVotes, numFacilitators, description }) =>
                <Table.Row key={id}>
                  <Table.Cell>
                    <Form>
                      <Form.Field>
                        <input placeholder='Session name' defaultValue={name} />
                      </Form.Field>
                      <p>
                        {`(${numVotes} votes, ${numFacilitators} facilitator${numFacilitators === 1 ? '' : 's'})`}
                      </p>
                      <Form.Field>
                        <Form.TextArea placeholder='Session description' defaultValue={description} />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Form>
                      <Form.Button color="green" icon>
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
        <h4>Change Nomination and Voting Times</h4>
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
)(SessionsPage);
