import React, { Component } from 'react';
import { Button, Form, Header, Message, Modal } from 'semantic-ui-react';

export default class LoginDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  setUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onLogin = () => {
    this.props.login(this.state.username, this.state.password);
  };

  onSignup = () => {
    this.props.signup(this.state.username, this.state.password);
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.onLogin();
    }
  };

  render() {
    let errorContainer;
    if (this.props.loginError) {
      let message = this.props.loginError;
      if (message === 'Forbidden') {
        message = 'Invalid username or password.  Please try again.';
      }

      errorContainer = (
        <Message
          error
          content={message}
        />
      );
    }

    return (
      <Modal open={true} className="login">
        <Header content="Please login or create an account" />
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Username</label>
              <input
                placeholder="Username"
                value={this.state.username}
                onChange={this.setUsername}
                onKeyDown={this.onKeyDown}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                placeholder="Password"
                value={this.state.password}
                onChange={this.setPassword}
                onKeyDown={this.onKeyDown}
              />
            </Form.Field>
          </Form>

          {errorContainer}

        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.onSignup} disabled={this.props.loginRunning}>
            Create Account
          </Button>
          <Button color="green" onClick={this.onLogin} disabled={this.props.loginRunning}>
            Log In
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
