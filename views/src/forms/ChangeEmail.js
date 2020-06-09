import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import noty from '../helpers/noty.js';
import got from '../helpers/refreshToken';

class ChangeEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { newEmail } = this.state;
    got('/user/resetEmail', 'post', {email: newEmail})
        .then((response) => {
          if (!response.status) {
            noty('Ошибка смены email', 'error');
            response.json();
          } else return response.json();
        })
        .then((data) => {
          if (!data.status) {
            noty('Ошибка смены email', 'error');
          } else noty('Успешная смена email', 'success');
        })
        .catch((error) => {
          console.dir(error);
          noty(`Ошибка смены email (${error.message})`, 'error');
        });
    }

  render() {
    return (
      <>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formNewMail">
              <Form.Label>Новый e-mail</Form.Label>
              <Form.Control
                placeholder="Введите новый e-mail"
                name="newEmail"
                value={this.state.newEmail}
                onChange={this.handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" block>
              Сменить e-mail
            </Button>
          </Form>
        </>
    )
}
}

export default ChangeEmail;
