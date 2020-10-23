import React from 'react';
import CourseThumbnail from './CourseThumbnail';
import { COURSES } from '../data/Courses';
import { Col, Jumbotron, Row } from 'react-bootstrap';
import { BRAND_NAME } from '../Constants';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
    return (
        <>
            <Jumbotron>
                <h1>Learn to code!</h1>
                <p>
                    Here at {BRAND_NAME} we are dedicated to teaching you how to programming! Below you will see a full catalog of all the courses we have to offer!
                    If there is something that you are interested in but don't see below, please feel free to <Link to="/contact">contact</Link> us and let us know!
                </p>
                <br/>
                <p>
                    Seeing how there aren't any coding videos yet please let us know what you would like to see here and enjoy this call of duty content!
                </p>
            </Jumbotron>
            <Row>
                {COURSES.map(course => (
                    <Col lg={4}>
                        <CourseThumbnail
                            {...course}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default CoursesPage;