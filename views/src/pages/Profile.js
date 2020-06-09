import React, { Component } from 'react';
import { Tab, Card, Nav, Row, Col, Button, Modal } from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import ChangePass from '../forms/ChangePass';
import ChangeEmail from '../forms/ChangeEmail';
import ViewUserQuestions from './ViewUserQuestions';
import ViewUserAnswer from './ViewUserAnswer';
import got from '../helpers/got';
import refreshToken from '../helpers/refreshToken';

/**
 * AuthProblem = 0 - Нет проблем
 * AuthProblem = 1 - Недействительный accessToken
 * AuthProblem = 2 - Не получилось рефрешнуть токен
 */

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      authProblem: sessionStorage.getItem('needRefreshToken'),
    };
    this.handleAuthProblem = this.handleAuthProblem.bind(this);
  }

  componentDidMount() {
    this.setState({ authProblem: sessionStorage.getItem('needRefreshToken') });
  }

  handleAuthProblem() {
    if (+sessionStorage.getItem('needRefreshToken') === 1) {
      return;
    }

    this.setState({ authProblem: '1' });
    sessionStorage.setItem('needRefreshToken', 1);

    refreshToken()
      .then(() => {
        this.setState({ authProblem: sessionStorage.getItem('needRefreshToken') });
        this.props.history.push('/profile');
      })
  }

  handleShowModal() {
    this.setState({
      showModal: true,
    });
  }

  handleClose(action) {
    if (action !== 'exit') {
      return this.setState({ showModal: false });
    }
  
    got('/logout', 'post')
      .catch((error) => {
        console.error(error);
        sessionStorage.setItem('needRefreshToken', 2);
      });

    sessionStorage.clear();
    localStorage.clear();
    this.props.history.push('/');
  }

  render() {
    const { showModal, authProblem } = this.state;
    
    if (!localStorage.getItem('accessToken') || authProblem === '2') {
      return (
        <>
          <h3 style={{ textAlign: 'center' }}>
            <NavLink exact to="/">
              Авторизуйтесь
            </NavLink>
            , чтобы увидеть свой профиль
          </h3>
        </>
      );
    }
    
    return (
      <>
        <Modal show={showModal} onHide={() => this.handleClose('close')} centered>
          <Modal.Header>
            <Modal.Title>Подтвердите выход из аккаунта</Modal.Title>
          </Modal.Header>
          <Modal.Body>Вы действительно хотите выйти?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose('close')}>
              Закрыть
            </Button>
            <Button id="exit" variant="danger" onClick={() => this.handleClose('exit')}>
              Выйти
            </Button>
          </Modal.Footer>
        </Modal>
        <Tab.Container id="left-tabs-example" defaultActiveKey="actions">
          <Row>
            <Col sm={3}>
              <Nav className="flex-column" variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="actions">Действия с аккаунтом</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="questions">Мои вопросы</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="answers">Мои ответы</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={7} lg={6}>
              <Tab.Content>
                <Tab.Pane eventKey="actions">
                  <Row className="justify-content-center">
                    <Button onClick={() => this.handleShowModal()} variant="danger">
                      Выйти из аккаунта
                    </Button>
                  </Row>
                  <hr />
                  <Card border="info">
                    <Card.Header className="text-center">Смена пароля</Card.Header>
                    <Card.Body>
                      <ChangePass />
                    </Card.Body>
                  </Card>
                  <br />
                  <Card border="info">
                    <Card.Header className="text-center">Смена e-mail</Card.Header>
                    <Card.Body>
                      <ChangeEmail />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="questions">
                  <Card border="info">
                    <Card.Header className="text-center">Мои вопросы</Card.Header>
                    <Card.Body>
                      <ViewUserQuestions onAuthProblem={this.handleAuthProblem} />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="answers">
                  <Card border="info">
                    <Card.Header className="text-center">Мои ответы</Card.Header>
                    <Card.Body>
                      <ViewUserAnswer onAuthProblem={this.handleAuthProblem} />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </>
    );
  }
}

export default Profile;
