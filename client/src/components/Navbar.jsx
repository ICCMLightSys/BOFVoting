import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { logout } from '../actions/user';

class Navbar extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item>
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/sessions">Sessions</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/conferenceadmin">Conference Admin</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/siteadmin">Site Admin</NavLink>
        </Menu.Item>
        <Menu.Item position="right">
          <Button onClick={() => this.props.dispatch(logout())}>Log out</Button>
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(
  state => ({})
)(Navbar);