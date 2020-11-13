import React from 'react';
import Video from './Video';
import {Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../css/components/VideoPage.scss';
import { buildVideoUrl } from '../../util/url-builders';
import Markdown from '../Markdown';

const VideoLinkRow = ({course, video}) => (
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
);

const NonEditableVideoPage = ({course, video}) => (
        <>
            <Row className="justify-content-center">
                <Col>
                    <h4>{video.title}</h4>
                </Col>
            </Row>
            <Row>
                <Col lg={10}>
                    <Row className="justify-content-center align-items-end shadow-sm p-3">
                        <Col lg={{offset: 1, span: 7}}>
                            <Video src={video.videoSrc} title={video.title}/>
                        </Col>
                        <Col lg={12}>
                            <VideoLinkRow course={course} video={video} />
                        </Col>
                    </Row>
                    <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                        <Col lg={12}>
                            <Markdown>{video.description}</Markdown>
                        </Col>
                        <Col lg={12}>
                            <VideoLinkRow course={course} video={video} />
                        </Col>
                    </Row>
                </Col>
                <Col lg={2} className="shadow-sm">
                    This is where cool subscriber only content will be displayed!
                </Col>
            </Row>
        </>
    );

export default NonEditableVideoPage;