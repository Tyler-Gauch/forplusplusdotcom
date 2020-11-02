import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { getCourse } from '../../graphql/queries';
import { connect } from 'react-redux';
import { addCourses } from '../store/actions';
import { buildCourseUrl, buildVideoUrl } from '../util/url-builders';
import { updateCourse } from '../../graphql/mutations';

const mapStateToProps = (state) => {
    const courses = state.courses || [];
    const user = state.user || null;
    return {courses, user};
};

const CoursePage = ({match, courses, user}) => {

    const history = useHistory();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [updateCourseError, setUpdateCourseError] = useState(null);

    const toggleEdit = () => setEdit(!edit);
    const toggleAdminOnly = () => {
        let response = false;
        if (course.adminOnly) {
            response = window.confirm("This course is currently only visible to admins. By confirming this you are making this course visible to all users. Are you sure you want to do this?");
        } else {
            response = window.confirm("This course is currently visible to everyone. By confirming this you will be removing the course from being visible to end users. Are you sure you want to do this?");
        }

        if (response) {
            handleUpdate({adminOnly: !course.adminOnly}, true);
        }
    };

    const handleUpdate = (fieldsToUpdate, refreshPage = false) => {
        const {createdAt, updatedAt, ...wantedCourseValues} = course;

        const newCourse = {
            ...wantedCourseValues,
            ...fieldsToUpdate
        }

        API.graphql(graphqlOperation(updateCourse, {input: newCourse}))
            .then((response) => {
                addCourses([response.data.getCourse]);
                if (refreshPage) {
                    history.push(buildCourseUrl(course.id));
                }
            })
            .catch(response => {
                setUpdateCourseError(JSON.stringify(response.errors));
            });
    }

    const handleSetCourse = wantedCourse => {
        if (wantedCourse.adminOnly && (!user || !user.isAdmin())) {
            console.log("Admin only");
            setError(true);
            return;
        }

        setError(false);
        setCourse(wantedCourse);
    };

    useEffect(() => {
        const wantedId = match.params.courseId;
        const wantedCourse = courses.find(c => c.id === wantedId);

        if (wantedCourse) {
            handleSetCourse(wantedCourse);
        } else {
            API.graphql({...graphqlOperation(getCourse, {id: match.params.courseId}), authMode: "API_KEY"})
                .then(response => {
                    handleSetCourse(response.data.getCourse);
                    addCourses([response.data.getCourse]);
                })
                .catch(error => {
                    console.log(error);
                    setError(true);
                });
        }

    }, [match, courses]);

    return (
        <>
            {error && <Alert variant="danger">We are sorry we were unable to find that course!</Alert>}
            {course && <>
                    {user && user.isAdmin() &&
                        <Alert variant="warning">
                            <h4>Admin Zone!</h4>
                            <Form.Check checked={edit} onChange={toggleEdit} label="Edit Mode"/>
                            <Button variant="primary" onClick={toggleAdminOnly}>
                                {course.adminOnly ? "Publish Course" : "Remove Course"}
                            </Button>
                            {updateCourseError && <Alert variant="danger">{updateCourseError}</Alert>}
                        </Alert>
                    }

                    <Row>
                        <h4>{course.title}</h4>
                    </Row>
                    <Row>
                        <p>{course.description}</p>
                    </Row>
                    <Row>
                        <ul>
                            {course.videos.map(video => (
                                <li key={video.id}><Link to={buildVideoUrl(course.id, video.id)}>{video.title}</Link></li>
                            ))}
                        </ul>
                    </Row>
                </>
            }
        </>
    );
};

export default connect(mapStateToProps)(CoursePage);