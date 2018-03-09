import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form, Icon, Table } from 'semantic-ui-react';
import { setTimes } from '../actions/conference';
import { fetchSessions, updateSession, deleteSession, mergeSessions } from '../actions/session';
import { fetchVotes } from '../actions/vote';
import AddSession from './AddSession';
import { fetchFacilitators, setFacilitateAdmin } from '../actions/facilitate';
import { fetchUsers } from '../actions/user';

class ConferenceAdminPage extends Component {
  constructor(props) {
    super(props);


    this.nameFields = [];
    this.descriptionFields = [];

    this.state = {
      editedSessions: [],
      timeZoneSecondsOffset: 0,
      timeZoneStringOffset: '+00:00',
    };

    this.handleChangeTimesSubmit = this.handleChangeTimesSubmit.bind(this);
  }

  handleChangeTimesSubmit(e, data) {
    const nominationStartTime = new Date(this.nominationStartTime.value + ` ${this.state.timeZoneStringOffset}`);
    const nominationEndTime = new Date(this.nominationEndTime.value + ` ${this.state.timeZoneStringOffset}`);
    const votingStartTime = new Date(this.votingStartTime.value + ` ${this.state.timeZoneStringOffset}`);
    const votingEndTime = new Date(this.votingEndTime.value + ` ${this.state.timeZoneStringOffset}`);
    if (isNaN(nominationStartTime.getTime()) || isNaN(nominationEndTime.getTime()) ||
      isNaN(votingStartTime.getTime()) || isNaN(votingEndTime.getTime())) {
      console.log('invalid date'); // TODO display error
    } else {
      this.props.dispatch(setTimes(nominationStartTime, nominationEndTime, votingStartTime, votingEndTime));
    }
  }

  componentDidUpdate() {
    this.props.sessions.forEach(({ id, name, description }) => {
      if (!this.props.sessionsUpdating.includes(id) && !this.state.editedSessions.includes(id)) {
        if (this.nameFields[id].value !== name) {
          this.nameFields[id].value = name;
        }
        if (this.descriptionFields[id].value !== description) {
          this.descriptionFields[id].value = description;
        }
      }
    });
  }

  componentDidMount() {
    this.props.dispatch(fetchSessions(this.props.conferenceId));
    this.props.dispatch(fetchVotes(this.props.conferenceId));
    this.props.dispatch(fetchFacilitators());
    this.props.dispatch(fetchUsers());
  }

  render() {
    return (
      <div>
        {
          this.props.fetchingSessions ? (
            <h2>Loading sessions...</h2>
          ) : (
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
                  }).map(({id, name, votes, facilitators, description}) =>
                    <Table.Row key={id}>
                      <Table.Cell>
                        <Form>
                          <Form.Field>
                            <input
                              placeholder='Session name'
                              defaultValue={name}
                              ref={nameField => this.nameFields[id] = nameField}
                              onChange={() => {
                                if (!this.state.editedSessions.includes(id)) {
                                  this.setState({editedSessions: this.state.editedSessions.concat([id])});
                                }
                              }}/>
                          </Form.Field>
                          <p>
                            {`(${votes} votes, ${facilitators} facilitator${facilitators === 1 ? '' : 's'})`}
                          </p>
                          <Form.Field>
                            <textarea
                              placeholder="Session description"
                              defaultValue={description}
                              ref={descriptionField => this.descriptionFields[id] = descriptionField}
                              onChange={() => {
                                if (!this.state.editedSessions.includes(id)) {
                                  this.setState({editedSessions: this.state.editedSessions.concat([id])});
                                }
                              }}/>
                          </Form.Field>
                          <div className="facilitators-and-merging-container">
                            <Dropdown className="facilitators-and-merging-dropdown" placeholder="Select a user" fluid
                              selection
                              onChange={(e, data) => this.setState({[`facilitatorsDropdown_${id}`]: data.value})}
                              options={
                                this.props.users.map(user => ({
                                  key: user.id,
                                  value: user.id,
                                  text: user.username
                                }))
                              }
                            />
                            <Form.Button color="green" icon
                              onClick={() => {
                                this.props.dispatch(setFacilitateAdmin(id, this.state[`facilitatorsDropdown_${id}`], true));
                              }}>
                              <Icon name='plus'/>&nbsp;&nbsp;Add Facilitator
                            </Form.Button>
                          </div>
                          <div className="facilitators-and-merging-container">
                            <Dropdown className="facilitators-and-merging-dropdown" placeholder="Select another session"
                              fluid selection
                              onChange={(e, data) => this.setState({[`sessionsDropdown_${id}`]: data.value})}
                              options={
                                this.props.sessions
                                  .filter(session => session.id !== id)
                                  .map(session => ({key: session.id, value: session.id, text: session.name}))
                              }
                            />
                            <Form.Button color="green" icon
                              onClick={() => {
                                this.props.dispatch(mergeSessions(id, this.state[`sessionsDropdown_${id}`]));
                              }}>
                              <Icon name='refresh'/>&nbsp;&nbsp;Merge
                            </Form.Button>
                          </div>
                        </Form>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Form>
                          <Form.Button disabled={!this.state.editedSessions.includes(id)} color="green" icon
                            onClick={() => {
                              const editedSessions = [...this.state.editedSessions];
                              editedSessions.splice(editedSessions.indexOf(id), 1);
                              this.setState({editedSessions});
                              this.props.dispatch(updateSession({
                                id,
                                name: this.nameFields[id].value,
                                description: this.descriptionFields[id].value,
                              }));
                            }}>
                            <Icon
                              name='save'/>&nbsp;&nbsp;{this.props.sessionsUpdating.includes(id) ? 'Saving' : 'Save'}
                          </Form.Button>
                        </Form>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Form>
                          <Form.Button color="red" icon onClick={() => this.props.dispatch(deleteSession(id))}>
                            <Icon name='trash'/>&nbsp;&nbsp;Delete
                          </Form.Button>
                        </Form>
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>
            </Table>
          )
        }
        <AddSession />
        <h2>Change Nomination and Voting Times</h2>
        <Dropdown className="timezone-dropdown" placeholder="Time Zone" search selection
          onChange={(e, data) => {
            const value = data.value;
            const offsetString = value.slice(0, 3);
            const offset = parseInt(offsetString, 10);
            const fraction = parseInt(value.charAt(4), 10);
            this.setState({
              timeZoneSecondsOffset: offset * 3600 + fraction * 15 * 60,
              timeZoneStringOffset: (offset >= 0 ? '+' : '') + offset + ':' + fraction * 15,
            });
          }}
          defaultValue="000b0"
          options={
            [
              { key: '1',  value: '-12a0', text: '(GMT-12:00) International Date Line West' },
              { key: '2',  value: '-11a0', text: '(GMT-11:00) Midway Island, Samoa' },
              { key: '3',  value: '-10a0', text: '(GMT-10:00) Hawaii' },
              { key: '4',  value: '-09a0', text: '(GMT-09:00) Alaska' },
              { key: '5',  value: '-08a0', text: '(GMT-08:00) Pacific Time (US & Canada)' },
              { key: '6',  value: '-08b0', text: '(GMT-08:00) Tijuana, Baja California' },
              { key: '7',  value: '-07a0', text: '(GMT-07:00) Arizona' },
              { key: '8',  value: '-07b0', text: '(GMT-07:00) Chihuahua, La Paz, Mazatlan' },
              { key: '9',  value: '-07c0', text: '(GMT-07:00) Mountain Time (US & Canada)' },
              { key: '10', value: '-06a0', text: '(GMT-06:00) Central America' },
              { key: '11', value: '-06b0', text: '(GMT-06:00) Central Time (US & Canada)' },
              { key: '12', value: '-06c0', text: '(GMT-06:00) Guadalajara, Mexico City, Monterrey' },
              { key: '13', value: '-06d0', text: '(GMT-06:00) Saskatchewan' },
              { key: '14', value: '-05a0', text: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco' },
              { key: '15', value: '-05b0', text: '(GMT-05:00) Eastern Time (US & Canada)' },
              { key: '16', value: '-05c0', text: '(GMT-05:00) Indiana (East)' },
              { key: '17', value: '-04a0', text: '(GMT-04:00) Atlantic Time (Canada)' },
              { key: '18', value: '-04b0', text: '(GMT-04:00) Caracas, La Paz' },
              { key: '19', value: '-04c0', text: '(GMT-04:00) Manaus' },
              { key: '20', value: '-04d0', text: '(GMT-04:00) Santiago' },
              { key: '21', value: '-03a2', text: '(GMT-03:30) Newfoundland' },
              { key: '22', value: '-03b0', text: '(GMT-03:00) Brasilia' },
              { key: '23', value: '-03c0', text: '(GMT-03:00) Buenos Aires, Georgetown' },
              { key: '24', value: '-03d0', text: '(GMT-03:00) Greenland' },
              { key: '25', value: '-03e0', text: '(GMT-03:00) Montevideo' },
              { key: '26', value: '-02a0', text: '(GMT-02:00) Mid-Atlantic' },
              { key: '27', value: '-01a0', text: '(GMT-01:00) Cape Verde Is.' },
              { key: '28', value: '-01b0', text: '(GMT-01:00) Azores' },
              { key: '29', value: '000a0', text: '(GMT+00:00) Casablanca, Monrovia, Reykjavik' },
              { key: '30', value: '000b0', text: '(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London' },
              { key: '31', value: '001a0', text: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
              { key: '32', value: '001b0', text: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague' },
              { key: '33', value: '001c0', text: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
              { key: '34', value: '001d0', text: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb' },
              { key: '35', value: '001e0', text: '(GMT+01:00) West Central Africa' },
              { key: '36', value: '002a0', text: '(GMT+02:00) Amman' },
              { key: '37', value: '002b0', text: '(GMT+02:00) Athens, Bucharest, Istanbul' },
              { key: '38', value: '002c0', text: '(GMT+02:00) Beirut' },
              { key: '39', value: '002d0', text: '(GMT+02:00) Cairo' },
              { key: '40', value: '002e0', text: '(GMT+02:00) Harare, Pretoria' },
              { key: '41', value: '002f0', text: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius' },
              { key: '42', value: '002g0', text: '(GMT+02:00) Jerusalem' },
              { key: '43', value: '002h0', text: '(GMT+02:00) Minsk' },
              { key: '44', value: '002i0', text: '(GMT+02:00) Windhoek' },
              { key: '45', value: '003a0', text: '(GMT+03:00) Kuwait, Riyadh, Baghdad' },
              { key: '46', value: '003b0', text: '(GMT+03:00) Moscow, St. Petersburg, Volgograd' },
              { key: '47', value: '003c0', text: '(GMT+03:00) Nairobi' },
              { key: '48', value: '003d0', text: '(GMT+03:00) Tbilisi' },
              { key: '49', value: '003a2', text: '(GMT+03:30) Tehran' },
              { key: '50', value: '004a0', text: '(GMT+04:00) Abu Dhabi, Muscat' },
              { key: '51', value: '004b0', text: '(GMT+04:00) Baku' },
              { key: '52', value: '004c0', text: '(GMT+04:00) Yerevan' },
              { key: '53', value: '004a2', text: '(GMT+04:30) Kabul' },
              { key: '54', value: '005a0', text: '(GMT+05:00) Yekaterinburg' },
              { key: '55', value: '005b0', text: '(GMT+05:00) Islamabad, Karachi, Tashkent' },
              { key: '56', value: '005a2', text: '(GMT+05:30) Sri Jayawardenapura' },
              { key: '57', value: '005b2', text: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
              { key: '58', value: '005a3', text: '(GMT+05:45) Kathmandu' },
              { key: '59', value: '006a0', text: '(GMT+06:00) Almaty, Novosibirsk' },
              { key: '60', value: '006b0', text: '(GMT+06:00) Astana, Dhaka' },
              { key: '61', value: '006a2', text: '(GMT+06:30) Yangon (Rangoon)' },
              { key: '62', value: '007a0', text: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
              { key: '63', value: '007b0', text: '(GMT+07:00) Krasnoyarsk' },
              { key: '64', value: '008a0', text: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
              { key: '65', value: '008b0', text: '(GMT+08:00) Kuala Lumpur, Singapore' },
              { key: '66', value: '008c0', text: '(GMT+08:00) Irkutsk, Ulaan Bataar' },
              { key: '67', value: '008d0', text: '(GMT+08:00) Perth' },
              { key: '68', value: '008e0', text: '(GMT+08:00) Taipei' },
              { key: '69', value: '009a0', text: '(GMT+09:00) Osaka, Sapporo, Tokyo' },
              { key: '70', value: '009b0', text: '(GMT+09:00) Seoul' },
              { key: '71', value: '009c0', text: '(GMT+09:00) Yakutsk' },
              { key: '72', value: '009a2', text: '(GMT+09:30) Adelaide' },
              { key: '73', value: '009b2', text: '(GMT+09:30) Darwin' },
              { key: '74', value: '010a0', text: '(GMT+10:00) Brisbane' },
              { key: '75', value: '010b0', text: '(GMT+10:00) Canberra, Melbourne, Sydney' },
              { key: '76', value: '010c0', text: '(GMT+10:00) Hobart' },
              { key: '77', value: '010d0', text: '(GMT+10:00) Guam, Port Moresby' },
              { key: '78', value: '010e0', text: '(GMT+10:00) Vladivostok' },
              { key: '79', value: '011a0', text: '(GMT+11:00) Magadan, Solomon Is., New Caledonia' },
              { key: '80', value: '012a0', text: '(GMT+12:00) Auckland, Wellington' },
              { key: '81', value: '012b0', text: '(GMT+12:00) Fiji, Kamchatka, Marshall Is.' },
              { key: '82', value: '013a0', text: '(GMT+13:00) Nuku\'alofa' },
            ]
          }
        />
        <Form>
          <Form.Field>
            <label>Nomination Start Time</label>
            <input
              ref={nominationStartField => this.nominationStartTime = nominationStartField}
              placeholder="yyyy-mm-dd hh:mm" />
          </Form.Field>
          <Form.Field>
            <label>Nomination End Time</label>
            <input
              ref={nominationEndTime => this.nominationEndTime = nominationEndTime}
              placeholder="yyyy-mm-dd hh:mm" />
          </Form.Field>
          <Form.Field>
            <label>Voting Start Time</label>
            <input
              ref={votingStartTime => this.votingStartTime = votingStartTime}
              placeholder="yyyy-mm-dd hh:mm" />
          </Form.Field>
          <Form.Field>
            <label>Voting End Time</label>
            <input
              ref={votingEndTime => this.votingEndTime = votingEndTime}
              placeholder="yyyy-mm-dd hh:mm" />
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
    users: state.user.users,
    facilitate: state.facilitate.facilitate,
    facilitators: state.facilitate.facilitators,
    sessionsUpdating: state.session.sessionsUpdating,
    fetchingSessions: state.session.fetchingSessions,
  })
)(ConferenceAdminPage);
