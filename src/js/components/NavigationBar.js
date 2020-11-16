import React from "react";
import Navbar from "react-bootstrap/Navbar";
import PropTypes from "prop-types";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { connect } from 'react-redux';
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { setAdminMode } from "../store/actions";

const mapStateToProps = (state) => {
    const user = state.user;
    const adminMode = state.adminMode
    return {user, adminMode};
};

const NavigationBar = ({user, logoutCallback, loginCallback, adminMode, setAdminMode}) => {

  const currentLocation = useLocation();

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="#home">ForPlusPlus</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
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
          {user
            ?
              <NavDropdown title={user.getFullname()} id="my-account-dropdown">
                {!user.isSubscribed() &&
                  <>
                    <NavDropdown.Item href="#">
                      Subscribe <FontAwesomeIcon icon={faYoutube} />
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                }
                {user.isAdmin() &&
                  <>
                    <NavDropdown.Item href="#" onClick={() => setAdminMode(!adminMode)}>
                      Turn {adminMode ? "off" : "on"} Admin Mode <FontAwesomeIcon icon={faCogs} />
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                }
                <NavDropdown.Item onClick={logoutCallback}>Logout</NavDropdown.Item>
              </NavDropdown>
            :
              <Nav.Item>
                <Nav.Link onClick={() => loginCallback(currentLocation)}>Login <FontAwesomeIcon icon={faYoutube} /> </Nav.Link>
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

export default connect(mapStateToProps, {setAdminMode})(NavigationBar);