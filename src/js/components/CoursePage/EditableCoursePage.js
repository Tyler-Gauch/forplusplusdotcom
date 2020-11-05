import React, { useState } from 'react';
import { Alert, Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { connect } from 'react-redux';
import { addOrUpdateCourses, removeCourses } from '../../store/actions';
import { buildCourseUrl } from '../../util/url-builders';
import { createCourse, deleteCourse, updateCourse } from '../../../graphql/mutations';
import { encodeTitleToId } from '../../util/encoders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import NewVideoModal from '../NewVideoModal';
import { appendVideo, removeVideo } from '../../util/course-helpers';
import VideoPreview from '../VideoPreview';
import { DELETE } from '../../constants/adminActions';

const mapStateToProps = (state) => {
    const courses = state.courses || [];
    return {courses};
};

const EditableCoursePage = ({course, addOrUpdateCourses, removeCourses}) => {

    const history = useHistory();
    const [updateCourseError, setUpdateCourseError] = useState(null);
    const [updateCourseSuccess, setUpdateCourseSuccess] = useState(null);
    const [newTitle, setNewTitle] = useState(null);
    const [newDescription, setNewDescription] = useState(null);

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

    const handleUpdateTitle = () => {
        setUpdateCourseSuccess(null);
        if (!newTitle) {
            setUpdateCourseError("Title cannot be empty.");
            return;
        } else if(newTitle === course.title) {
            setUpdateCourseSuccess("Nothing to update");
            return;
        }

        const proceed = window.confirm("This will change the id and cause a page refresh are you sure you want to do this?");

        if (!proceed) {
            setNewTitle("");
            return;
        }

        const newId = encodeTitleToId(newTitle);
        const fieldsToUpdate = {
            id: newId,
            title: newTitle
        }

        const {createdAt, updatedAt, ...wantedCourseValues} = course;

        const newCourse = {
            ...wantedCourseValues,
            ...fieldsToUpdate
        }

        API.graphql(graphqlOperation(createCourse, {input: newCourse}))
            .then((response) => {
                addOrUpdateCourses([response.data.getCourse]);
                setUpdateCourseSuccess("Course updated successfully");
                API.graphql(graphqlOperation(deleteCourse, {input: {id: course.id}}))
                    .then(() => {
                        removeCourses([course]);
                        history.push(buildCourseUrl(newId));
                    })
                    .catch(response => {
                        setUpdateCourseError("Failed to delete old course: " + JSON.stringify(response.errors));
                    });
            })
            .catch(response => {
                setUpdateCourseError("Failed to create new course: " + JSON.stringify(response.errors));
            });
    }

    const handleUpdateDescription = () => {
        if (!newDescription) {
            setUpdateCourseError("Description cannot be empty");
            return;
        } else if (newDescription === course.description) {
            setUpdateCourseSuccess("Nothing to update");
            return;
        }

        handleUpdate({description: newDescription});
    };

    const handleVideoChange = action => {
        switch (action.type) {
            case DELETE:
                handleRemoveVideo(action.payload.id);
        }
    }

    const handleNewVideo = video => {        
        const updatedCourse = appendVideo(course, video);
        if (!updatedCourse) {
            setUpdateCourseError("Failed to add new video check console for more info");
            return;
        }

        handleUpdate({videos: updatedCourse.videos}, false);
    }

    const handleRemoveVideo = videoId => {
        const updatedCourse = removeVideo(course, videoId);
        if (!updatedCourse) {
            setUpdateCourseError("Failed to add new video check console for more info");
            return;
        }

        handleUpdate({videos: updatedCourse.videos}, false);
    }

    const handleUpdate = (fieldsToUpdate, refreshPage = false) => {
        setUpdateCourseSuccess(null);
        const {createdAt, updatedAt, ...wantedCourseValues} = course;

        const newCourse = {
            ...wantedCourseValues,
            ...fieldsToUpdate
        }

        API.graphql(graphqlOperation(updateCourse, {input: newCourse}))
            .then((response) => {
                addOrUpdateCourses([response.data.updateCourse]);
                setUpdateCourseSuccess("Course updated successfully");
                if (refreshPage) {
                    history.push(buildCourseUrl(newCourse.id));
                }
            })
            .catch(response => {
                setUpdateCourseError(JSON.stringify(response.errors));
            });
    }

    return (
        <>
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Row>
                            <Col lg={10}>
                                <h4>Admin Zone!</h4>
                            </Col>
                            <Col lg={2}>
                                <Button variant="primary" onClick={toggleAdminOnly}>
                                    {course.adminOnly ? "Publish Course" : "Remove Course"}
                                </Button>
                            </Col>
                        </Row>
                        <Row><NewVideoModal onSuccess={handleNewVideo} /></Row>
                        {updateCourseError && <Row><Alert variant="danger">{updateCourseError}</Alert></Row>}
                        {updateCourseSuccess && <Row><Alert variant="success">{updateCourseSuccess}</Alert></Row>}
                    </Alert>
                </Col>
            </Row>

            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Title" defaultValue={course.title} onChange={event => setNewTitle(event.target.value)} />    
                        <InputGroup.Append>
                            <Button variant="primary" onClick={handleUpdateTitle}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl as="textarea" aria-label="With textarea" defaultValue={course.description} onChange={event => setNewDescription(event.target.value)}/>
                        <InputGroup.Append>
                            <Button variant="primary" onClick={handleUpdateDescription}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                {course.videos.map(video => (
                    <Col lg={4}>
                        <VideoPreview key={video.id} courseId={course.id} video={video} onAdminChange={handleVideoChange}/>
                    </Col>
                ))}
            </Row>
        </>);
};

export default connect(mapStateToProps, {removeCourses, addOrUpdateCourses})(EditableCoursePage);