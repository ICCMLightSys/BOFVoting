import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Header, Radio, Table } from 'semantic-ui-react';
import { getCount } from '../selectors/user';
import * as voteTypes from '../constants/voteTypes';
import { addSession, fetchSessions } from '../actions/session';

class SessionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: {
        'Lorem Ipsum': voteTypes.NO,
        'Lorem Ipsum v2.0': voteTypes.NO,
      },
      facilitate: []
    };

    this.handleAddSessionSubmit = this.handleAddSessionSubmit.bind(this);
  }

  handleAddSessionSubmit(e, data) {
    const session = { name: this.nameField.value, description: this.descriptionField.value };
    this.props.dispatch(addSession(session));
  }

  componentDidMount() {
    this.props.dispatch(fetchSessions(1)); // TODO don't hardcode conference ID
  }

  render() {
    return (
      <div>
        <Table celled padded>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell singleLine>BOF sessions</Table.HeaderCell>
              <Table.HeaderCell>Participate?</Table.HeaderCell>
              <Table.HeaderCell>Facilitate?</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.props.sessions.map(({name, numVotes, numFacilitators, description}) =>
                <Table.Row>
                  <Table.Cell>
                    <Header as='h4'>
                      {`${name} (${numVotes} votes, ${numFacilitators} facilitator${numFacilitators === 1 ? '' : 's'})`}
                    </Header>
                    {description}
                  </Table.Cell>
                  <Table.Cell singleLine>
                    <Form>
                      <Form.Field>
                        <Radio
                          label='Yes'
                          name='votingGroup'
                          value='yes'
                          checked={this.state.votes[name] === voteTypes.YES}
                          onChange={() => this.setState({ votes: { ...this.state.votes, [name]: voteTypes.YES } })}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='Alt'
                          name='votingGroup'
                          value='alt'
                          checked={this.state.votes[name] === voteTypes.ALT}
                          onChange={() => this.setState({ votes: { ...this.state.votes, [name]: voteTypes.ALT } })}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Radio
                          label='No'
                          name='votingGroup'
                          value='no'
                          checked={this.state.votes[name] === voteTypes.NO}
                          onChange={() => this.setState({ votes: { ...this.state.votes, [name]: voteTypes.NO } })}
                        />
                      </Form.Field>
                    </Form>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Checkbox onChange={(e, data) => {
                      if(data.checked) {
                        this.setState({ facilitate: [...this.state.facilitate, name] });
                      } else {
                        const facilitate = [...this.state.facilitate];
                        const currentIndex = facilitate.indexOf(name);
                        if(currentIndex !== -1) {
                          facilitate.splice(currentIndex, 1);
                          this.setState({ facilitate });
                        }
                      }
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
            <input ref={nameField => this.nameField = nameField} placeholder='Name' />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea ref={descriptionField => this.descriptionField = descriptionField} placeholder='Description' />
          </Form.Field>
          <Form.Button type='submit' onClick={this.handleAddSessionSubmit}>Submit</Form.Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    count: getCount(state),
    sessions: state.session.sessions
  })
)(SessionsPage);
