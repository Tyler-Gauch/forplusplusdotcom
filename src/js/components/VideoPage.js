import React, {Fragment} from 'react';
import Video from './Video';
import {Row, Col} from 'react-bootstrap';
import SubscriberSideBar from './SubscriberSideBar';

const VideoPage = ({heading, videoSrc}) => (
    <Fragment>
        <Row>
            <h4>{heading}</h4>
        </Row>
        <Row>
            <Col xs="10">
                <Row className="justify-content-md-center">
                    <Video
                        src="https://www.youtube.com/embed/lX1fKrCBjww"
                    />
                </Row>
            </Col>
            <Col xs="2">
                <SubscriberSideBar />
            </Col>
        </Row>
    </Fragment>
);

export default VideoPage;