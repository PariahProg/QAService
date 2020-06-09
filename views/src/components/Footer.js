import React, { Component } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" className="footer" sticky="bottom">
          <Container>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-center">
              <Navbar.Text>
                &copy;{new Date().getFullYear()} Designed By DrewProg | All rights reserved
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default Footer;
