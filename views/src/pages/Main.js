import React, { Component } from 'react';
import Log from '../forms/Log.js';
import Reg from '../forms/Reg.js';
import { Row, Col, Card, Nav, Tab } from 'react-bootstrap';

export default class Main extends Component {
  render() {
    return (
      <>
        <Tab.Container id="left-tabs-example" defaultActiveKey="log">
          <Row>
            <Col sm={3}>
              <Nav className="flex-column" variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="log">Вход</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reg">Регистрация</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={7} lg={5}>
              <Tab.Content>
                <Tab.Pane eventKey="log">
                  <Card border="info">
                    <Card.Header className="text-center">Вход</Card.Header>
                    <Card.Body>
                      <Log />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="reg">
                  <Card border="info">
                    <Card.Header className="text-center">Регистрация</Card.Header>
                    <Card.Body>
                      <Reg />
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
