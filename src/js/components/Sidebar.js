import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Nav, NavDropdown, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/components/Sidebar.scss';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import { COURSES } from '../data/Courses';

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
                <Nav.Link><Link to="/">Home</Link></Nav.Link>
            </Nav.Item>
            <NavDropdown title="Courses" id="courses-dropdown">
                {COURSES.map(course => (
                    <NavDropdown.Item key={course.id}>
                        <Link to={`/course/${course.id}`}>{course.title}</Link>
                    </NavDropdown.Item>
                ))}
            </NavDropdown>
            <Nav.Item>
                <Nav.Link><Link to="/about">About</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link><Link to="/contact">Contact</Link></Nav.Link>
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