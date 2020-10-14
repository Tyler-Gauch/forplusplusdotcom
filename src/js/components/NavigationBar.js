import React, { Component, Fragment } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faYoutube} from "@fortawesome/free-brands-svg-icons"

class NavigationBar extends Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">ForPlusPlus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
              {this.props.userAttributes
                ?
                  <NavDropdown title={this.props.userAttributes.name} id="my-account-dropdown">
                    <NavDropdown.Item href="#">
                        <Fragment>Subscribe </Fragment>
                        <FontAwesomeIcon icon={faYoutube} />
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" onClick={this.props.logoutCallback}>Logout</NavDropdown.Item>
                  </NavDropdown>
                :
                  <NavDropdown title="My Account" id="my-account-dropdown">
                    <NavDropdown.Item href="#" onClick={this.props.loginCallback}>Login</NavDropdown.Item>
                  </NavDropdown>
              }
        </Navbar.Collapse>
      </Navbar>
      );
    }
}

NavigationBar.propTypes = {
  userAttributes: PropTypes.object
};

export default NavigationBar;
