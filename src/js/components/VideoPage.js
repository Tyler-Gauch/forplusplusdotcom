import React, { useEffect, useState } from 'react';
import Video from './Video';
import {Row, Col, Alert, Form, FormControl, InputGroup, Button, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../css/components/VideoPage.scss';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCourse } from '../../graphql/mutations';
import { connect } from 'react-redux';
import { getCourse } from '../../graphql/queries';
import { addCourses } from '../store/actions';
import { encodeTitleToId } from '../util/encoders';
import { useHistory } from 'react-router-dom';
import { buildVideoUrl } from '../util/url-builders';
import Markdown from './Markdown';

const mapStateToProps = state => {
    const courses = state.courses || [];
    const user = state.user || null;
    return {courses, user};
};

const errorMessage = "";

const VideoPage = ({match, courses, addCourses, user}) => {

    const [course, setCourse] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoNotFound, setVideoNotFound] = useState(false);
    const [updateVideoError, setUpdateVideoError] = useState(null);
    const [edit, setEdit] = useState(false);
    const history = useHistory();

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const toggleEdit = () => setEdit(!edit);

    const handleUpdateTitle = () => {
        if (newTitle === "" || newTitle === video.title) {
            return;
        }

        const proceed = window.confirm("This will change the id and cause a page refresh are you sure you want to do this?");

        if (!proceed) {
            setNewTitle("");
            return;
        }

        const newId = encodeTitleToId(newTitle);
        handleUpdate({...video, id: newId, title: newTitle}, true);
    };

    const handleUpdateDescription = () => {
        if (newDescription === "" || newDescription === video.description) {
            return;
        }

        handleUpdate({...video, description: newDescription});
    };

    const handleUpdate = (newVideo, refreshPage = false) => {
        const {createdAt, updatedAt, ...wantedCourseValues} = course;

        const newCourse = {
            ...wantedCourseValues,
            videos: course.videos.filter(v => v.id !== video.id).concat([newVideo])
        }

        API.graphql(graphqlOperation(updateCourse, {input: newCourse}))
            .then((response) => {
                addCourses([response.data.getCourse]);
                if (refreshPage) {
                    history.push(buildVideoUrl(course.id, newVideo.id));
                }
            })
            .catch(response => {
                setUpdateVideoError(JSON.stringify(response.errors));
            });
    }

    const loadVideoFromCourse = (wantedVideoId, course) => {
        const wantedVideo = course.videos.find(v => v.id === wantedVideoId);
        if (!wantedVideo) {
            setVideoNotFound(errorMessage);
            return;
        }

        setVideoNotFound(null);
        setCourse(course);
        setVideo(wantedVideo);
        setNewDescription(wantedVideo.description);
        setNewTitle(wantedVideo.title);
    };

    useEffect(() => {
        if (courses.length === 0) {
            setVideoNotFound(true);
            return;
        }

        const wantedCourseId = match.params.courseId;
        const wantedVideoId = match.params.videoId;
        const wantedCourse = courses.find(c => c.id === wantedCourseId);
        if (!wantedCourse) {
            API.graphql({...graphqlOperation(getCourse, {id: wantedCourseId}), authMode: "API_KEY"})
                .then(response => {
                    addCourses([response.data.getCourse]);
                    loadVideoFromCourse(wantedVideoId, response.data.getCourse);
                })
                .catch(error => {
                    console.log(error);
                    setVideoNotFound(errorMessage);
                });
            
            return;
        }

        loadVideoFromCourse(wantedVideoId, wantedCourse);        
    }, [match, courses, addCourses]);

    if (!videoNotFound && !video) {
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }

    return videoNotFound
        ? (<Alert variant="error"><h4>Sorry we are unable to find the video you are looking for.</h4></Alert>)
        : (<>
            {user && user.isAdmin() &&
                <Alert variant="warning">
                    <h4>Admin Zone!</h4>
                    <Form.Check checked={edit} onChange={toggleEdit} label="Edit Mode"/>
                </Alert>
            }
            <Row className="justify-content-center">
                <Col>
                    {!edit
                        ? <h4>{video.title}</h4>
                        : <InputGroup className="mb-3">
                            <FormControl placeholder="Title" defaultValue={video.title} onChange={event => setNewTitle(event.target.value)} />    
                            <InputGroup.Append>
                                <Button variant="primary" onClick={handleUpdateTitle}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    }
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
                                        <Link to={video.previousVideo.link}>Previous: {video.previousVideo.text}</Link>
                                    </Col>
                                }
                                {video.nextVideo &&
                                    <Col lg={(video.previousVideo ? 6 : {offset: 6, span: 6})} className="text-right">
                                        <Link to={video.nextVideo.link}>Next: {video.nextVideo.text}</Link>
                                    </Col>
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                            {!edit
                                ? <Col><Markdown>{video.description}</Markdown></Col>
                                : <>
                                    <Col lg={12}>
                                    <InputGroup className="mb-3">
                                        <FormControl as="textarea" aria-label="With textarea" defaultValue={video.description} onChange={event => setNewDescription(event.target.value)}/>
                                        <InputGroup.Append>
                                            <Button variant="primary" onClick={handleUpdateDescription}><FontAwesomeIcon icon={faCheckCircle}/></Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                     
                                    </Col>
                                    <Col lg={12}>
                                        <Markdown>{newDescription}</Markdown>
                                    </Col>
                                  </>
                            }
                    </Row>
                </Col>
                <Col lg={2} className="shadow-sm">
                    This is where cool subscriber only content will be displayed!
                </Col>
            </Row>
        </>)
};

export default connect(mapStateToProps, {addCourses})(VideoPage);