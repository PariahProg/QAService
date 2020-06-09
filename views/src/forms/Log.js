import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import noty from '../helpers/noty.js';
import { Redirect } from 'react-router-dom';
import got from '../helpers/got';

class Log extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      passShow: false,
      isAccess: false,
      accessToken: '',
      redirect: false,
      isLoading: false,
    };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSwitchChange(event) {
    this.setState({
      passShow: !this.state.passShow,
    });
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
    const { login, password: passValue } = this.state;
    this.setState({ isLoading: true });
    if (passValue.length < 8) {
      noty('Длина пароля не может быть меньше 8 символов!', 'warning');
    } else {
      got('/user/signIn', 'post', {
        login: login,
        password: passValue,
      })
        .then((response) => {
          if (!response.status) {
            noty('Ошибка входа', 'error');
            response.json();
          } else return response.json();
        })
        .then((result) => {
          let self = this;
          self.setState({
            isAccess: result.status,
            accessToken: result.accessToken,
          });
          sessionStorage.setItem('login', result.login);
        })
        .then((data) => {
          let self = this;
          if (self.state.isAccess === false) {
            noty('Ошибка входа', 'error');
          } else {
            localStorage.setItem('accessToken', self.state.accessToken);
            sessionStorage.setItem('currentUsername', self.state.login);
            sessionStorage.setItem('needRefreshToken', 0);
            noty('Вход выполнен успешно!', 'success');
            this.setState({ redirect: true, isLoading:false });
            //snoty('Подтвердите регистрацию. Проверьте письмо на указанном почтовом ящике, оно также могло попасть в "Спам"', 'success');
          }
        })
        .catch((error) => {
          console.dir(error);
          noty(`Ошибка входа (${error.message})`, 'error');
          this.setState({
            isLoading:false
          })
        });
        this.setState({
          isLoading:false
        })
    }
  }

  render() {
    const { redirect, isLoading } = this.state;
    if (redirect) {
      return <Redirect to="/questions" />;
    }
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email/Логин</Form.Label>
            <Form.Control
              placeholder="Введите email или логин"
              name="login"
              value={this.state.login}
              onChange={this.handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type={this.state.passShow ? 'text' : 'password'}
              placeholder="Пароль"
              value={this.state.password}
              name="password"
              onChange={this.handleInputChange}
              required
            />
            <Form.Check
              type="switch"
              id="custom-switch-log"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check custom id="chckbx-log" type="checkbox" label="Я не робот" required />
          </Form.Group>
          <Button variant="dark" type="submit" disabled={isLoading} block>
            {isLoading ? 'Загрузка...' : 'Войти'}
          </Button>
        </Form>
      </>
    );
  }
}

export default Log;
