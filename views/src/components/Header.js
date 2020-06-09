import React, { Component } from 'react';
import {
  Navbar,
  Container,
  FormControl,
  Button,
  Nav,
  Form,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import logo from '../assets/logo_question.png';
import './Header.css';
import { withRouter } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
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

  handleSubmit() {
    sessionStorage.setItem('searchText', this.state.text);
    //return(<Redirect to='/search'/>);
  }

  render() {
    const { location } = this.props;
    return (
      <>
        <Navbar
          fixed="top"
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          className="topBar"
        >
          <Container>
            <Navbar.Brand>
              <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
                <img
                  src={logo}
                  height="30"
                  width="30"
                  className="d-inline-block align-top"
                  alt="logo"
                />{' '}
                Q/A
              </a>
            </Navbar.Brand>
            <Navbar.Toggle area-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/" active={location.pathname === '/'}>
                  {' '}
                  Главная{' '}
                </Nav.Link>
                <Nav.Link href="questions" active={location.pathname === '/questions'}>
                  {' '}
                  Вопросы{' '}
                </Nav.Link>
                <Nav.Link href="create_question" active={location.pathname === '/create_question'}>
                  {' '}
                  Спросить{' '}
                </Nav.Link>
                <Nav.Link href="contacts" active={location.pathname === '/contacts'}>
                  {' '}
                  Контакты{' '}
                </Nav.Link>
                <Nav.Link href="profile" active={location.pathname === '/profile'}>
                  {' '}
                  Профиль
                </Nav.Link>
              </Nav>
              <Form inline>
                <Row>
                  <Col>
                    <FormControl
                      name="text"
                      value={this.state.text}
                      onChange={this.handleInputChange}
                      type="text"
                      placeholder="Поиск..."
                      className="md-auto"
                    />
                  </Col>
                  <Col>
                    <Button href="search" onClick={this.handleSubmit} variant="outline-light">
                      Искать
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default withRouter(Header);
