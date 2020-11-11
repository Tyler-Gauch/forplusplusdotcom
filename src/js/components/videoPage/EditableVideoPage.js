import React, { useState } from 'react';
import Video from './Video';
import {Row, Col, Alert, FormControl, InputGroup, Button, Spinner, Container, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import { Link, Prompt } from 'react-router-dom';
import '../../../css/components/VideoPage.scss';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCourse } from '../../../graphql/mutations';
import { connect } from 'react-redux';
import { addOrUpdateCourses } from '../../store/actions';
import { encodeTitleToId } from '../../util/encoders';
import { useHistory } from 'react-router-dom';
import { buildVideoUrl } from '../../util/url-builders';
import Markdown from '../Markdown';
import '../../../css/utils/utilities.scss';
import { replaceVideo } from '../../util/course-helpers';

const mapStateToProps = state => {
    const courses = state.courses || [];
    return {courses };
};

const EditableVideoPage = ({course, video, addOrUpdateCourses}) => {

    const history = useHistory();

    const [updateVideoError, setUpdateVideoError] = useState(null);
    const [updateVideoSuccess, setUpdateVideoSuccess] = useState(null);
    const [newTitle, setNewTitle] = useState(video.title);
    const [newDescription, setNewDescription] = useState(video.description);
    const [newSrc, setNewSrc] = useState(video.videoSrc);
    const [newAdminOnly, setNewAdminOnly] = useState(video.adminOnly);

    const toggleAdminOnly = () => setNewAdminOnly(!newAdminOnly);

    const handleUpdate = () => {
        setUpdateVideoSuccess(null);
        setUpdateVideoError(null);
        if (!hasChangesToSave()) {
            setUpdateVideoSuccess("No updates to save.");
            return;
        } else if (!validateSave()) {
            return;
        }

        const fieldsToUpdate = {
            id: encodeTitleToId(newTitle),
            title: newTitle,
            description: newDescription,
            videoSrc: newSrc,
            adminOnly: newAdminOnly
        };

        const newVideo = {
            ...video,
            ...fieldsToUpdate
        };

        const updatedCourse = replaceVideo(course, video.id, newVideo);
        
        if (updatedCourse === null) {
            setUpdateVideoError(["Failed to update video check console for more information"]);
            return;
        }

        const {createdAt, updatedAt, ...newCourse } = updatedCourse;
        const refreshPage = video.id !== fieldsToUpdate.id;

        API.graphql(graphqlOperation(updateCourse, {input: newCourse}))
            .then((response) => {
                addOrUpdateCourses([response.data.updateCourse]);
                setUpdateVideoSuccess("Video updated successfully");
                if (refreshPage) {
                    history.push(buildVideoUrl(course.id, newVideo.id));
                }
            })
            .catch(response => {
                setUpdateVideoError([JSON.stringify(response.errors)]);
            });
    }

    const hasChangesToSave = () => {
        return newTitle !== video.title
            || newDescription !== video.description
            || newSrc !== video.videoSrc
            || newAdminOnly !== video.adminOnly;
    }

    const validateSave = () => {
        const errors = [];

        if (!newTitle) {
            errors.push("Title cannot be empty.");
        }

        if (!newDescription) {
            errors.push("Description cannot be empty.");
        }

        if (!newSrc) {
            errors.push("Video source cannot be empty.");
        }

        if (errors.length > 0) {
            setUpdateVideoError(errors);
            return false;
        }

        return true;
    }

    return (
        <>
            <Prompt
                when={hasChangesToSave}
                message="You have unsaved changes, are you sure you want to leave?"
            />
            <Alert variant="warning">
                <Row>
                    <h4>Admin Zone!</h4>
                </Row>
                <Row>
                    <ButtonToolbar>
                        <ButtonGroup className="mr-2" aria-label="Admin buttons">
                            <Button variant="primary" onClick={handleUpdate}>Save <FontAwesomeIcon icon={faSave}/></Button>
                        </ButtonGroup>
                        <ButtonGroup className="mr-2" aria-label="Admin buttons">
                            <Button variant="primary" onClick={toggleAdminOnly}>
                                {newAdminOnly ? "Publish Video" : "Remove Video"}
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Row>
                {updateVideoError && <Row>
                    <Alert variant="danger">
                        <ul>{updateVideoError.map(error => (<li>{error}</li>))}</ul>
                    </Alert>
                </Row>}
                {updateVideoSuccess && <Row><Alert variant="success">{updateVideoSuccess}</Alert></Row>}
            </Alert>
            
            <Row className="justify-content-center">
                <Col>
                    <FormControl placeholder="Title" defaultValue={video.title} onChange={event => setNewTitle(event.target.value)} />    
                </Col>
            </Row>
            <Row>
                <Col lg={10}>
                    <Row className="justify-content-center align-items-end shadow-sm p-3">
                        <Col lg={{offset: 1, span: 7}}>
                            <Video src={video.videoSrc} title={video.title}/>
                        </Col>
                        <Col lg={12}>
                            <Row>
                                {video.previousVideo &&
                                    <Col lg={6}>
                                        <Link to={buildVideoUrl(course.id, video.previousVideo.otherVideoId)}>Previous: {video.previousVideo.text}</Link>
                                    </Col>
                                }
                                {video.nextVideo &&
                                    <Col lg={(video.previousVideo ? 6 : {offset: 6, span: 6})} className="text-right">
                                        <Link to={buildVideoUrl(course.id, video.nextVideo.otherVideoId)}>Next: {video.nextVideo.text}</Link>
                                    </Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg={2} className="shadow-sm">
                    This is where cool subscriber only content will be displayed!
                </Col>
            </Row>
            <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                <Col lg={6}>
                    <InputGroup className="fill-height">
                        <FormControl as="textarea" aria-label="With textarea" defaultValue={video.description} onChange={event => setNewDescription(event.target.value)} />
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <Markdown>{newDescription}</Markdown>
                </Col>
            </Row>
        </>)
};

export default connect(mapStateToProps, {addOrUpdateCourses})(EditableVideoPage);