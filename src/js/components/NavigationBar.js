import React from "react";
import Navbar from "react-bootstrap/Navbar";
import PropTypes from "prop-types";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const NavigationBar = ({userAttributes, logoutCallback, loginCallback}) => {

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="#home">ForPlusPlus</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
              <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end" id="user-admin-nav">
        <Nav>
          {userAttributes
            ?
              <NavDropdown title={userAttributes.name} id="my-account-dropdown">
                <NavDropdown.Item href="#">
                  Subscribe <FontAwesomeIcon icon={faYoutube} />
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutCallback}>Logout</NavDropdown.Item>
              </NavDropdown>
            :
              <Nav.Item>
                <Nav.Link onClick={loginCallback}>Login <FontAwesomeIcon icon={faYoutube} /> </Nav.Link>
              </Nav.Item>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    );
}

NavigationBar.propTypes = {
  userAttributes: PropTypes.object
};

export default NavigationBar;