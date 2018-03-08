import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { addSession } from '../actions/session';

class AddSession extends Component {
  constructor(props) {
    super(props);

    this.handleAddSessionSubmit = this.handleAddSessionSubmit.bind(this);
  }

  handleAddSessionSubmit(e, data) {
    const session = { name: this.nameField.value, description: this.descriptionField.value };
    this.props.dispatch(addSession(session));
    this.nameField.value = '';
    this.descriptionField.value = '';
  }

  render() {
    return (
      <div>
        <h2>Add Session</h2>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input ref={nameField => this.nameField = nameField} placeholder="Name" />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea ref={descriptionField => this.descriptionField = descriptionField} placeholder="Description" />
          </Form.Field>
          <Form.Button color="green" type="submit" onClick={this.handleAddSessionSubmit}>Submit</Form.Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({})
)(AddSession);
