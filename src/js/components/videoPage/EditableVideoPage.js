import React, { useState } from 'react';
import Video from './Video';
import {Row, Col, Alert, FormControl, InputGroup, Button, Spinner, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../css/components/VideoPage.scss';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCourse } from '../../../graphql/mutations';
import { connect } from 'react-redux';
import { addOrUpdateCourses } from '../../store/actions';
import { encodeTitleToId } from '../../util/encoders';
import { useHistory } from 'react-router-dom';
import { buildVideoUrl } from '../../util/url-builders';
import Markdown from '../Markdown';

const mapStateToProps = state => {
    const courses = state.courses || [];
    return {courses };
};

const VideoPage = ({course, video, addOrUpdateCourses}) => {

    const history = useHistory();

    const [updateVideoError, setUpdateVideoError] = useState(null);
    const [updateVideoSuccess, setUpdateVideoSuccess] = useState(null);
    const [newTitle, setNewTitle] = useState(video.title);
    const [newDescription, setNewDescription] = useState(video.description);

    const toggleAdminOnly = () => {
        let response = false;
        if (video.adminOnly) {
            response = window.confirm("This video is currently only visible to admins. By confirming this you are making this video visible to all users. Are you sure you want to do this?");
        } else {
            response = window.confirm("This video is currently visible to everyone. By confirming this you will be removing the video from being visible to end users. Are you sure you want to do this?");
        }

        if (response) {
            handleUpdate({adminOnly: !video.adminOnly}, true);
        }
    };

    const handleUpdateTitle = () => {
        setUpdateVideoSuccess(null);
        setUpdateVideoError(null);
        if (!newTitle) {
            setUpdateVideoError("Title cannot be empty");
            return;
        } else if (newTitle === video.title) {
            setUpdateVideoSuccess("Nothing to update");
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
        };

        handleUpdate(fieldsToUpdate, true);
    };

    const handleUpdateDescription = () => {
        setUpdateVideoSuccess(null);
        setUpdateVideoError(null);
        if (!newDescription) {
            setUpdateVideoError("Description cannot be empty");
            return;
        } else if (newDescription === video.description) {
            setUpdateVideoSuccess("Nothing to update");
            return;
        }

        handleUpdate({description: newDescription});
    };

    const handleUpdate = (fieldsToUpdate, refreshPage = false) => {
        const {createdAt, updatedAt, ...wantedCourseValues} = course;
        const newVideo = {
            ...video,
            ...fieldsToUpdate
        };

        const newCourse = {
            ...wantedCourseValues,
            videos: course.videos.filter(v => v.id !== video.id).concat([newVideo])
        }

        API.graphql(graphqlOperation(updateCourse, {input: newCourse}))
            .then((response) => {
                addOrUpdateCourses([response.data.getCourse]);
                setUpdateVideoSuccess("Video updated successfully");
                if (refreshPage) {
                    history.push(buildVideoUrl(course.id, newVideo.id));
                }
            })
            .catch(response => {
                setUpdateVideoError(JSON.stringify(response.errors));
            });
    }

    return (
        <>
            <Container>
                <Alert variant="warning">
                    <h4>Admin Zone!</h4>
                    {updateVideoError && <Row><Alert variant="danger">{updateVideoError}</Alert></Row>}
                    {updateVideoSuccess && <Row><Alert variant="success">{updateVideoSuccess}</Alert></Row>}
                </Alert>
                
                <Row className="justify-content-center">
                    <Col>
                        <InputGroup className="mb-3">
                            <FormControl placeholder="Title" defaultValue={video.title} onChange={event => setNewTitle(event.target.value)} />    
                            <InputGroup.Append>
                                <Button variant="primary" onClick={handleUpdateTitle}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={10}>
                        {updateVideoError && <Alert variant="error">{updateVideoError}</Alert>}
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
            </Container>
            <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                <Col lg={6}>
                    <InputGroup className="mb-3">
                        <FormControl as="textarea" aria-label="With textarea" defaultValue={video.description} onChange={event => setNewDescription(event.target.value)}/>
                        <InputGroup.Append>
                            <Button variant="primary" onClick={handleUpdateDescription}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <Markdown>{newDescription}</Markdown>
                </Col>
            </Row>
        </>)
};

export default connect(mapStateToProps, {addOrUpdateCourses})(VideoPage);