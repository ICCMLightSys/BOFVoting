import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginDialog from './LoginDialog';
import { login, signup } from '../actions/user';

function LoginRequired(props) {
  if (props.isLoggedIn) {
    return props.children;
  } else {
    return <LoginDialog {...props} />
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.jwtToken != null,
  loginRunning: state.user.loginRunning,
  loginError: state.user.loginError,
});

export default connect(mapStateToProps, { login, signup })(LoginRequired);
