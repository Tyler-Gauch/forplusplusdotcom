import React, { useState } from 'react';
import { Storage } from 'aws-amplify';
import Video from './Video';
import {Row, Col, Alert, FormControl, InputGroup, Button, ButtonGroup, ButtonToolbar, Form} from 'react-bootstrap';
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
import { v4 as uuid } from 'uuid';

const mapStateToProps = state => {
    const courses = state.courses || [];
    return {courses };
};

const EditableVideoPage = ({course, video, addOrUpdateCourses}) => {

    const history = useHistory();

    const [updateVideoError, setUpdateVideoError] = useState(null);
    const [updateVideoSuccess, setUpdateVideoSuccess] = useState(null);
    const [newVideo, setNewVideo] = useState(video);
    const setNewTitle = title => setNewVideo({...newVideo, title: title, id: encodeTitleToId(title)});
    const setNewDescription = description => setNewVideo({...newVideo, description});
    const setNewSrc = videoSrc => setNewVideo({...newVideo, videoSrc});
    const setNewAdminOnly = adminOnly => setNewVideo({...newVideo, adminOnly});

    const toggleAdminOnly = () => setNewAdminOnly(!newVideo.adminOnly);

    const handlePaste = (e) => {
        if (e.clipboardData && e.clipboardData.items) {

            // Get the items from the clipboard
            const items = e.clipboardData.items;
  
            // Loop through all items, looking for any kind of image
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                // We need to represent the image as a file
                const blob = items[i].getAsFile();
                const fileName = `${uuid()}.png`;

                Storage.put(fileName, blob)
                    .then (result => {
                        setNewDescription(`${newVideo.description}\n![:s3](${fileName})`);
                    })
                    .catch(err => console.log(err));
  
                // Prevent the image (or URL) from being pasted into the contenteditable element
                e.preventDefault();
              }
            }
          }
    }

    const handleUpdate = () => {
        setUpdateVideoSuccess(null);
        setUpdateVideoError(null);
        if (!hasChangesToSave()) {
            setUpdateVideoSuccess("No updates to save.");
            return;
        } else if (!validateSave()) {
            return;
        }

        const updatedCourse = replaceVideo(course, video.id, newVideo);
        
        if (updatedCourse === null) {
            setUpdateVideoError(["Failed to update video check console for more information"]);
            return;
        }

        const {createdAt, updatedAt, ...newCourse } = updatedCourse;
        const refreshPage = video.id !== newVideo.id;

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
        return newVideo !== video;
    }

    const validateSave = () => {
        const errors = [];

        if (!newVideo.title) {
            errors.push("Title cannot be empty.");
        }

        if (!newVideo.description) {
            errors.push("Description cannot be empty.");
        }

        if (!newVideo.videoSrc) {
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
                                {newVideo.adminOnly ? "Publish Video" : "Remove Video"}
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Row>
                <Form.Group>
                    <Form.Label>Video Url</Form.Label>
                    <Form.Control type="url" placeholder="video url" defaultValue={newVideo.videoSrc} onChange={(e) => setNewSrc(e.target.value)} />
                </Form.Group>
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
                            <Video src={newVideo.videoSrc} title={newVideo.title}/>
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
                        <FormControl as="textarea" aria-label="With textarea" value={newVideo.description} onChange={event => setNewDescription(event.target.value)} onPaste={handlePaste} />
                    </InputGroup>
                </Col>
                <Col lg={6}>
                    <Markdown>{newVideo.description}</Markdown>
                </Col>
            </Row>
        </>)
};

export default connect(mapStateToProps, {addOrUpdateCourses})(EditableVideoPage);