import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import './Layout.css';

export default class Layout extends Component {
  render() {
    return (
      <div className="layout">
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
