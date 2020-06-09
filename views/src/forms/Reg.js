import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import noty from '../helpers/noty.js';
import got from '../helpers/got';

class Reg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      pass: '',
      confirmPass: '',
      isAccess: false,
      accessToken: '',
      passShow: false,
      confirmPassShow: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }

  handleSwitchChange(event) {
    if (event.target.id === 'custom-switch-2') {
      this.setState({
        confirmPassShow: !this.state.confirmPassShow,
      });
    } else {
      this.setState({
        passShow: !this.state.passShow,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, email, pass: passValue, confirmPass: pass2Value } = this.state;
    if (passValue.length < 8) {
      noty('Длина пароля не может быть меньше 8 символов!', 'warning');
    } else if (passValue !== pass2Value) {
      noty('Пароли не совпадают', 'warning');
    } else {
      got('/user/signUp', 'post', {
        username: username,
        email: email,
        password: passValue,
      })
        .then((response) => {
          if (!response.status) {
            noty('Ошибка регистрации', 'error');
            response.json();
          } else return response.json();
        })
        .then((result) => {
          let self = this;
          self.setState({
            isAccess: result.status,
            accessToken: result.accessToken,
          });
        })
        .then((data) => {
          let self = this;
          if (self.state.isAccess === false) noty('Ошибка регистрации', 'warning');
          else {
            sessionStorage.setItem('login', self.state.username);
            localStorage.setItem('accessToken', self.state.accessToken);
            noty(
              'Подтвердите регистрацию. Проверьте письмо на указанном почтовом ящике, оно также могло попасть в "Спам"',
              'success',
            );
          }
        })
        .catch((error) => {
          console.dir(error);
          noty(error.message, 'error');
        });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Логин</Form.Label>
            <Form.Control
              placeholder="Введите логин"
              value={this.state.username}
              onChange={this.handleInputChange}
              name="username"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={this.state.email}
              onChange={this.handleInputChange}
              name="email"
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type={this.state.passShow ? 'text' : 'password'}
              placeholder="Пароль"
              value={this.state.pass}
              onChange={this.handleInputChange}
              name="pass"
              required
            />
            <Form.Text className="text-muted">
              Пароль должен содержать минимум 8 символов: цифры и буквы
            </Form.Text>
            <Form.Check
              type="switch"
              id="custom-switch-reg"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Повторите пароль</Form.Label>
            <Form.Control
              type={this.state.confirmPassShow ? 'text' : 'password'}
              placeholder="Повторите пароль"
              value={this.state.confirmPass}
              onChange={this.handleInputChange}
              name="confirmPass"
              required
            />
            <Form.Check
              type="switch"
              id="custom-switch-2"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check custom id="chckbx-reg" type="checkbox" label="Я не робот" required />
          </Form.Group>
          <Button variant="dark" type="submit" block>
            Зарегистрироваться
          </Button>
        </Form>
      </>
    );
  }
}

export default Reg;
