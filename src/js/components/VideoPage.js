import React, {Fragment} from 'react';
import Video from './Video';
import {Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const VideoPage = ({heading, videoSrc}) => (
    <Fragment>
        <Row>
            <Col>
                <h4>{heading}</h4>
            </Col>
        </Row>
        <Row>
            <Col lg={{span:5, offset:1}}>
                <Video src={videoSrc}/>
            </Col>
            <Col lg={{span:3, offset: 1}}>
                This is where cool subscriber only content will be displayed!
            </Col>
        </Row>
        <Row>
            <Col lg={1}>
                <Link to="/video/previous">Previous Video</Link>
            </Col>
            <Col lg={{span: 1, offset: 5}}>
                <Link to="/video/previous">Previous Video</Link>
            </Col>
        </Row>
        <Row>
            <Col lg={7}>
                <p>This is where a description of the video including a full walk through and how to in text form will be displayed!
                    We will need to make sure that this doesn't overflow into the subscriber content space to make sure that everything is cohesive!</p>
            </Col>
        </Row>
    </Fragment>
);

export default VideoPage;