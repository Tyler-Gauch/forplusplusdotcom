  
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Breakpoint } from "react-socks";

const NavigationBar = ({openSidebarCallback, isSidebarVisible}) => {

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Breakpoint sm down>
        <Button onClick={openSidebarCallback} variant="dark">
            {isSidebarVisible ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
        </Button>
      </Breakpoint>
      <Navbar.Brand href="#home">ForPlusPlus</Navbar.Brand>
    </Navbar>
    );
}

NavigationBar.propTypes = {
  userAttributes: PropTypes.object
};

export default NavigationBar;