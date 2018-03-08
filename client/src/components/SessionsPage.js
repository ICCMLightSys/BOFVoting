import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Header, Radio, Table } from 'semantic-ui-react';
import * as voteTypes from '../constants/voteTypes';
import { addSession, fetchSessions } from '../actions/session';
import { fetchVotes, setVote } from '../actions/vote';
import { fetchFacilitates, setFacilitate } from '../actions/facilitate';
import AddSession from './AddSession';

class SessionsPage extends Component {
  constructor(props) {
    super(props);

    this.handleAddSessionSubmit = this.handleAddSessionSubmit.bind(this);
  }

  handleAddSessionSubmit(e, data) {
    const session = { name: this.nameField.value, description: this.descriptionField.value };
    this.props.dispatch(addSession(session));
  }

  componentDidMount() {
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
    this.props.dispatch(fetchFacilitates(this.props.conferenceId));
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
              this.props.sessions.sort((a, b) => {
                // sort by vote count then alphabetical
                // only update vote counts when user refreshes page
                const difference = b.votes - a.votes;
                if(difference === 0) {
                  return a.name > b.name ? 1 : -1;
                } else {
                  return Math.sign(difference);
                }
              }).map(({ id, name, votes, facilitators, description }) =>
                <Table.Row key={id}>
                  <Table.Cell>
                    <Header as="h4">
                      {
                        `${name} (${votes} vote${votes === 1 ? '' : 's'}, ` +
                        `${facilitators} facilitator${facilitators === 1 ? '' : 's'})`
                      }
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
                          disabled={this.props.facilitate.includes(id)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="Alt"
                          name="votingGroup"
                          value="alt"
                          checked={this.props.votes[id] === voteTypes.ALT}
                          onChange={() => this.props.dispatch(setVote(id, voteTypes.ALT))}
                          disabled={this.props.facilitate.includes(id)}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label="No"
                          name="votingGroup"
                          value="no"
                          checked={this.props.votes[id] === voteTypes.NO || this.props.votes[id] === undefined}
                          onChange={() => this.props.dispatch(setVote(id, voteTypes.NO))}
                          disabled={this.props.facilitate.includes(id)}
                        />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Checkbox checked={this.props.facilitate.includes(id)} onChange={(e, data) => {
                      this.props.dispatch(setFacilitate(id, data.checked));
                      if(data.checked) {
                        this.props.dispatch(setVote(id, voteTypes.YES));
                      }
                    }} />
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>
        <AddSession />
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
