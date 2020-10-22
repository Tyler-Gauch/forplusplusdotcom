import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Nav, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/components/Sidebar.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

const Sidebar = ({isVisible}) => {
    return (
        <>
        <Nav
            className={cx({
                "bg-light": true,
                "flex-column": true,
                sidebar: true,
                show: isVisible
            })}
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
        </>
    );
};

Sidebar.propTypes = {
    isVisible: PropTypes.bool,
    toggleVisiblity: PropTypes.func
};

Sidebar.defaultProps = {
    isVisible: true
}

export default Sidebar;