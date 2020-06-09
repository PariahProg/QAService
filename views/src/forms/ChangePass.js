import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import noty from '../helpers/noty.js';
import got from '../helpers/refreshToken';

class ChangePass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
      confirmNewPass: '',
      oldPassShow: false,
      passShow: false,
      confirmPassShow: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleSubmitPass = this.handleSubmitPass.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSwitchChange(event) {
    const id = event.target.id;
    switch (id) {
      case 'custom-switch-confirmPass':
        this.setState({
          confirmPassShow: !this.state.confirmPassShow,
        });
        break;
      case 'custom-switch-oldPass':
        this.setState({
          oldPassShow: !this.state.oldPassShow,
        });
        break;
      case 'custom-switch-newPass':
        this.setState({
          passShow: !this.state.passShow,
        });
        break;
      default:
        alert('Неизвестное значение / Wrong value');
    }
  }

  handleSubmitPass(event) {
    event.preventDefault();
    const { newPass, confirmNewPass, oldPass } = this.state;
    if (newPass.length < 8 || confirmNewPass < 8) {
      noty('Длина пароля не может быть меньше 8 символов!', 'warning');
    } else if (newPass !== confirmNewPass) {
      noty('Пароли не совпадают', 'warning');
    } else if (oldPass === newPass) noty('Старый и новый пароли совпадают', 'warning'); else {
      got('/user/resetPassword', 'post', {password: newPass})
        .then((response) => {
          if (!response.status) {
            noty('Ошибка смены пароля', 'error');
        }})
        .then((data) => {
          if (!data.status) {
            noty('Ошибка смены пароля', 'error');
          } else noty('Успешная смена пароля', 'success');
        })
        .catch((error) => {
          console.dir(error);
          noty(error.message, 'error');
        });
    }
  }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmitPass}>
          <Form.Group controlId="formOldPass">
            <Form.Label>Старый пароль</Form.Label>
            <Form.Control
              type={this.state.oldPassShow ? 'text' : 'password'}
              placeholder="Введите старый пароль"
              name="oldPass"
              value={this.state.oldPass}
              onChange={this.handleInputChange}
              required
            />
            <Form.Check
              className="text-muted"
              type="switch"
              id="custom-switch-oldPass"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
            />
          </Form.Group>
          <Form.Group controlId="formNewPass">
            <Form.Label>Новый пароль</Form.Label>
            <Form.Control
              type={this.state.passShow ? 'text' : 'password'}
              placeholder="Введите новый пароль"
              name="newPass"
              value={this.state.newPass}
              onChange={this.handleInputChange}
              required
            />
            <Form.Text className="text-muted">
              Пароль должен содержать минимум 8 символов: цифры и буквы
            </Form.Text>
            <Form.Check
              className="text-muted"
              type="switch"
              id="custom-switch-newPass"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
            />
          </Form.Group>
          <Form.Group controlId="formConfirmNewPass">
            <Form.Label>Повторите новый пароль</Form.Label>
            <Form.Control
              type={this.state.confirmPassShow ? 'text' : 'password'}
              placeholder="Повторите новый пароль"
              name="confirmNewPass"
              value={this.state.confirmNewPass}
              onChange={this.handleInputChange}
              required
            />
            <Form.Text className="text-muted">
              Пароль должен содержать минимум 8 символов: цифры и буквы
            </Form.Text>
            <Form.Check
              type="switch"
              id="custom-switch-confirmPass"
              label="Скрыть/показать пароль"
              onChange={this.handleSwitchChange}
              className="text-muted"
            />
          </Form.Group>
          <Button variant="dark" type="submit" block>
            Сменить пароль
          </Button>
        </Form>
      </>
    );
  }
}

export default ChangePass;
