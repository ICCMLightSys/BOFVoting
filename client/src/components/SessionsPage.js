import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Header, Radio, Table } from 'semantic-ui-react';
import { getCount } from '../selectors/user';
import * as voteTypes from '../constants/voteTypes';

class SessionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: {
        'Lorem Ipsum': voteTypes.NO,
        'Lorem Ipsum v2.0': voteTypes.NO,
      },
      facilitate: []
    }
  }

  render() {
    return (
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
                    {`${name} (${numVotes} votes, ${numFacilitators} facilitator${numFacilitators > 1 ? 's' : ''})`}
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
    );
  }
}

export default connect(
  state => ({
    count: getCount(state),
    sessions: [
      { name: 'Lorem Ipsum', numVotes: 17.5, numFacilitators: 2, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { name: 'Lorem Ipsum v2.0', numVotes: 12, numFacilitators: 1, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
    ]
  })
)(SessionsPage);
