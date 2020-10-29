import React, { useEffect, useState } from 'react';
import { Alert, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { getCourse } from '../../graphql/queries';
import { connect } from 'react-redux';
import { addCourses } from '../store/actions';
import { buildVideoUrl } from '../util/url-builders';

const mapStateToProps = (state) => {
    const courses = state.courses;
    return {courses};
};

const CoursePage = ({match, courses}) => {

    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const wantedId = match.params.courseId;
        const wantedCourse = courses.find(c => c.id === wantedId);

        if (wantedCourse) {
            setCourse(wantedCourse);
        } else {
            API.graphql(graphqlOperation(getCourse, {id: match.params.courseId}))
                .then(response => {
                    setCourse(response.data.getCourse);
                    addCourses([response.data.getCourse]);
                })
                .catch(error => {
                    setError(error);
                });
        }

    }, [match, courses]);

    return (
        <>
            {error && <Alert variant="error">We are sorry we were unable to find that course!</Alert>}
            {course && <>
                    <Row>
                        <h4>{course.title}</h4>
                    </Row>
                    <Row>
                        <p>{course.description}</p>
                    </Row>
                    <Row>
                        <ul>
                            {course.videos.map(video => (
                                <li><Link to={buildVideoUrl(course.id, video.id)}>{video.title}</Link></li>
                            ))}
                        </ul>
                    </Row>
                </>
            }
        </>
    );
};

export default connect(mapStateToProps)(CoursePage);