import React, { useCallback, useState } from 'react';
import { Alert, Button, ButtonGroup, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Prompt, useHistory } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { connect } from 'react-redux';
import { addOrUpdateCourses, removeCourses } from '../../store/actions';
import { buildCourseUrl } from '../../util/url-builders';
import { createCourse, deleteCourse, updateCourse } from '../../../graphql/mutations';
import { encodeTitleToId } from '../../util/encoders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewVideoModal from '../NewVideoModal';
import { appendVideo, removeVideo, swapVideos } from '../../util/course-helpers';
import VideoPreview from '../VideoPreview';
import { DELETE } from '../../constants/adminActions';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const mapStateToProps = (state) => {
    const courses = state.courses || [];
    return {courses};
};

const EditableCoursePage = ({course, addOrUpdateCourses, removeCourses}) => {

    const history = useHistory();
    const [newCourse, setNewCourse] = useState(course);
    const [updateCourseError, setUpdateCourseError] = useState(null);
    const [updateCourseSuccess, setUpdateCourseSuccess] = useState(null);

    const toggleAdminOnly = () => {
        let response = false;
        if (course.adminOnly) {
            response = window.confirm("This course is currently only visible to admins. By confirming this you are making this course visible to all users. Are you sure you want to do this?");
        } else {
            response = window.confirm("This course is currently visible to everyone. By confirming this you will be removing the course from being visible to end users. Are you sure you want to do this?");
        }

        if (response) {
            setNewCourse({...newCourse, adminOnly: !newCourse.adminOnly});
        }
    };

    const setNewTitle = (title) => {
        setNewCourse({
            ...newCourse,
            id: encodeTitleToId(title),
            title
        });
    };

    const setNewDescription = (description) => {
        setNewCourse({
            ...newCourse,
            description
        })
    }

    const handleVideoChange = action => {
        switch (action.type) {
            case DELETE:
                handleRemoveVideo(action.payload.id);
        }
    }

    const handleNewVideo = video => {        
        const updatedCourse = appendVideo(newCourse, video);
        if (!updatedCourse) {
            setUpdateCourseError(["Failed to add new video check console for more info"]);
            return;
        }

        setNewCourse(updatedCourse);
    }

    const handleRemoveVideo = videoId => {
        const updatedCourse = removeVideo(newCourse, videoId);
        if (!updatedCourse) {
            setUpdateCourseError(["Failed to add new video check console for more info"]);
            return;
        }

        setNewCourse(updatedCourse);
    }

    const handleUpdate = () => {
        setUpdateCourseSuccess(null);
        setUpdateCourseError(null);
        if (!hasChangesToSave()) {
            setUpdateCourseSuccess("No updates to save.");
            return;
        } else if (!validateSave()) {
            return;
        }

        const {createdAt, updatedAt, ...wantedNewCourse} = newCourse;

        if (wantedNewCourse.id !== course.id) {
            // we are technically creating a new course
            // and deleting the old one so lets do that.
            API.graphql(graphqlOperation(createCourse, {input: wantedNewCourse}))
                .then((response) => {
                    addOrUpdateCourses([response.data.getCourse]);
                    setUpdateCourseSuccess("Course updated successfully");
                    API.graphql(graphqlOperation(deleteCourse, {input: {id: course.id}}))
                        .then(() => {
                            removeCourses([course]);
                            history.push(buildCourseUrl(wantedNewCourse.id));
                        })
                        .catch(response => {
                            setUpdateCourseError(["Failed to delete old course: " + JSON.stringify(response.errors)]);
                        });
                })
                .catch(response => {
                    setUpdateCourseError(["Failed to create new course: " + JSON.stringify(response.errors)]);
                });
        } else {
            API.graphql(graphqlOperation(updateCourse, {input: wantedNewCourse}))
                .then((response) => {
                    addOrUpdateCourses([response.data.updateCourse]);
                    setUpdateCourseSuccess("Course updated successfully");
                })
                .catch(response => {
                    setUpdateCourseError([JSON.stringify(response.errors)]);
                });
        }
    }

    const hasChangesToSave = () => {
        return newCourse !== course;
    }

    const validateSave = () => {
        const errors = [];

        if (!newCourse.title) {
            errors.push("Title cannot be empty.");
        }

        if (!newCourse.description) {
            errors.push("Description cannot be empty.");
        }

        if (errors.length > 0) {
            setUpdateCourseError(errors);
            return false;
        }

        return true;
    };

    const moveVideo = useCallback((dragIndex, hoverIndex) => {
        const video = newCourse.videos[dragIndex];
        const otherVideo = newCourse.videos[hoverIndex];
        const updatedCourse = swapVideos(newCourse, video.id, otherVideo.id);
        setNewCourse(updatedCourse);
    }, [newCourse]);

    return (
        <>
            <Prompt
                when={hasChangesToSave}
                message="You have unsaved changes, are you sure you want to leave?"
            />
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Row>
                            <Col lg={10}>
                                <h4>Admin Zone!</h4>
                            </Col>
                            <Col lg={2}>
                                <ButtonGroup className="mr-2" aria-label="Admin buttons">
                                    <Button variant="primary" onClick={handleUpdate}>Save <FontAwesomeIcon icon={faSave}/></Button>
                                </ButtonGroup>
                                <Button variant="primary" onClick={toggleAdminOnly}>
                                    {newCourse.adminOnly ? "Publish Course" : "Remove Course"}
                                </Button>
                            </Col>
                        </Row>
                        <Row><NewVideoModal onSuccess={handleNewVideo} /></Row>
                        {updateCourseError && <Row>
                            <Alert variant="danger">
                                <ul>{updateCourseError.map(error => (<li>{error}</li>))}</ul>
                            </Alert>
                        </Row>}
                        {updateCourseSuccess && <Row><Alert variant="success">{updateCourseSuccess}</Alert></Row>}
                    </Alert>
                </Col>
            </Row>

            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Title" defaultValue={course.title} onChange={event => setNewTitle(event.target.value)} />    
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl as="textarea" aria-label="With textarea" defaultValue={course.description} onChange={event => setNewDescription(event.target.value)}/>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                {newCourse.videos.map((video, i) => (
                    <Col lg={12} key={video.id}>
                        <VideoPreview courseId={course.id} video={video} onAdminChange={handleVideoChange} moveVideo={moveVideo} index={i}/>
                    </Col>
                ))}
            </Row>
        </>);
};

export default connect(mapStateToProps, {removeCourses, addOrUpdateCourses})(EditableCoursePage);