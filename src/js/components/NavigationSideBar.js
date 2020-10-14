import React, { Fragment } from "react";
import {Form, Nav} from "react-bootstrap";
import '../../css/components/NavigationSideBar.css'

const NavigationSideBar = props => {
    return (
        <Nav className="bg-light flex-column sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
        >
            <Form className="searchbar">
                <Form.Group controlId="search">
                    <Form.Control type="input" placeholder="Search" />
                </Form.Group>
            </Form>
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                Disabled
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
  };

  export default NavigationSideBar