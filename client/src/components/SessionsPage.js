import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Header, Radio, Table } from 'semantic-ui-react';
import * as voteTypes from '../constants/voteTypes';
import { addSession, fetchSessions } from '../actions/session';
import { setVote } from '../actions/vote';
import { setFacilitate } from '../actions/facilitate';

class SessionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      facilitate: [],
    };

    this.handleAddSessionSubmit = this.handleAddSessionSubmit.bind(this);
  }

  handleAddSessionSubmit(e, data) {
    const session = { name: this.nameField.value, description: this.descriptionField.value };
    this.props.dispatch(addSession(session));
  }

  componentDidMount() {
    this.props.dispatch(fetchSessions(this.props.conferenceId));
  }

  render() {
    return (
      <div>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell singleLine>BOF sessions</Table.HeaderCell>
              <Table.HeaderCell>Participate?</Table.HeaderCell>
              <Table.HeaderCell>Facilitate?</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.sessions.map(({ id, name, numVotes, numFacilitators, description }) =>
                <Table.Row key={id}>
                  <Table.Cell>
                    <Header as="h4">
                      {`${name} (${numVotes} votes, ${numFacilitators} facilitator${numFacilitators === 1 ? '' : 's'})`}
                    </Header>
                    {description}
                  </Table.Cell>
                  <Table.Cell singleLine>
                    <Form>
                      <Form.Field>
                        <Radio
                          label="Yes"
                          name="votingGroup"
                          value="yes"
                          checked={this.props.votes[id] === voteTypes.YES}
                          onChange={() => this.props.dispatch(setVote(id, voteTypes.YES))}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="Alt"
                          name="votingGroup"
                          value="alt"
                          checked={this.props.votes[id] === voteTypes.ALT}
                          onChange={() => this.props.dispatch(setVote(id, voteTypes.ALT))}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="No"
                          name="votingGroup"
                          value="no"
                          checked={this.props.votes[id] === voteTypes.NO || this.props.votes[id] === undefined}
                          onChange={() => this.props.dispatch(setVote(id, voteTypes.NO))}
                        />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Checkbox checked={this.props.facilitate.includes(id)} onChange={(e, data) => {
                      this.props.dispatch(setFacilitate(id, data.checked));
                    }} />
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
        <h4>Add Session</h4>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input ref={nameField => this.nameField = nameField} placeholder="Name" />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea ref={descriptionField => this.descriptionField = descriptionField} placeholder="Description" />
          </Form.Field>
          <Form.Button type="submit" onClick={this.handleAddSessionSubmit}>Submit</Form.Button>
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
