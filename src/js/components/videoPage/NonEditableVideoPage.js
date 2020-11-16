import React from 'react';
import Video from './Video';
import {Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../css/components/VideoPage.scss';
import { buildVideoUrl } from '../../util/url-builders';
import Markdown from '../Markdown';
import { isVideoAdminOnly } from '../../util/course-helpers';
import { verifyUserIsAdmin } from '../../util/user';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    const user = state.user || null;
    return {user};
}

const VideoLinkRow = ({course, video, user}) => {
    const userIsAdmin = verifyUserIsAdmin(user);
    const previousVideoIsAdminOnly = isVideoAdminOnly(course, video.previousVideo?.otherVideoId);
    const canShowPreviousVideo = !previousVideoIsAdminOnly || (previousVideoIsAdminOnly && userIsAdmin);
    const nextVideoIsAdminOnly = isVideoAdminOnly(course, video.nextVideo?.otherVideoId);
    const canShowNextVideo = !nextVideoIsAdminOnly || (nextVideoIsAdminOnly && userIsAdmin);

    return (
        <Row>
            {video.previousVideo && canShowPreviousVideo &&
                <Col lg={6}>
                    <Link to={buildVideoUrl(course.id, video.previousVideo.otherVideoId)}>Previous: {video.previousVideo.text}</Link>
                </Col>
            }
            {video.nextVideo && canShowNextVideo &&
                <Col lg={(video.previousVideo ? 6 : {offset: 6, span: 6})} className="text-right">
                    <Link to={buildVideoUrl(course.id, video.nextVideo.otherVideoId)}>Next: {video.nextVideo.text}</Link>
                </Col>
            }
        </Row>
    );
};

const NonEditableVideoPage = ({course, video, user}) => (
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
                            <VideoLinkRow course={course} video={video} user={user}/>
                        </Col>
                    </Row>
                    <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                        <Col lg={12}>
                            <Markdown>{video.description}</Markdown>
                        </Col>
                        <Col lg={12}>
                            <VideoLinkRow course={course} video={video} user={user}/>
                        </Col>
                    </Row>
                </Col>
                <Col lg={2} className="shadow-sm">
                    This is where cool subscriber only content will be displayed!
                </Col>
            </Row>
        </>
    );

export default connect(mapStateToProps)(NonEditableVideoPage);