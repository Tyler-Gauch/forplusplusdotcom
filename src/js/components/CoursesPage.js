import React from 'react';
import CoursePreview from './CoursePreview';
import { Alert, Jumbotron, Row, Col } from 'react-bootstrap';
import { BRAND_NAME } from '../Constants';
import { Link } from 'react-router-dom';
import NewCourseModal from './NewCourseModal';
import {connect} from 'react-redux';
import { verifyUserIsAdmin } from '../util/user';

const mapStateToProps = state => {
    const courses = state.courses || [];
    const user = state.user || null;
    const adminMode = state.adminMode || false;
    return {courses, user, adminMode};
  };

const CoursesPage = ({courses, user, adminMode}) => {
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
            {adminMode && verifyUserIsAdmin(user) &&
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <h4>Admin Zone</h4>
                            <NewCourseModal />
                        </Alert>
                    </Col>
                </Row>
            }
                {courses && courses.map(course => {
                    
                    if (course.adminOnly && (!user || !user.isAdmin())) {
                        return;
                    }

                    return (
                        <Row key={course.id}>
                            <Col>
                                <CoursePreview
                                    {...course}
                                />
                            </Col>
                        </Row>
                )})}
        </>
    );
};

export default connect(mapStateToProps)(CoursesPage);