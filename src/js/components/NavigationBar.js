import React, { Component } from "react";
import { Navbar, Nav, NavDropdown} from "react-bootstrap";
import PropTypes from "prop-types";

class NavigationBar extends Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">ForPlusPlus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
              {this.props.userAttributes
                ?
                  <NavDropdown title={this.props.userAttributes.name} id="my-account-dropdown">
                    <NavDropdown.Item href="#">Subscribe</NavDropdown.Item>
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
