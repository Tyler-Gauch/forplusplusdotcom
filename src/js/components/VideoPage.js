import React, {Fragment} from 'react';
import Video from './Video';
import {Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../css/components/VideoPage.scss';
import PropTypes from 'prop-types';

const VideoPage = ({id, title, videoSrc, descriptionHtml, nextVideo, previousVideo}) => (
    <div>
        <Row className="justify-content-center">
            <Col>
                <h4>{title}</h4>
            </Col>
        </Row>
        <Row>
            <Col lg={10}>
                <Row className="justify-content-center align-items-end shadow-sm p-3">
                    <Col lg={{offset: 1, span: 7}}>
                        <Video src={videoSrc}/>
                    </Col>
                    <Col lg={12}>
                        <Row>
                            {previousVideo && 
                                <Col lg={6}>
                                    <Link to={previousVideo.link}>{previousVideo.text}</Link>
                                </Col>
                            }
                            {nextVideo &&
                                <Col lg={(previousVideo ? 6 : {offset: 6, span: 6})} className="text-right">
                                    <Link to={nextVideo.link}>{nextVideo.text}</Link>
                                </Col>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row className="shadow-sm pl-5 pr-5 pt-3 pb-3">
                    <Col>
                        {descriptionHtml}
                    </Col>
                </Row>
            </Col>
            <Col lg={2} className="shadow-sm">
                This is where cool subscriber only content will be displayed!
            </Col>
        </Row>
    </div>
);

VideoPage.propTypes = {
    title: PropTypes.string.isRequired,
    videoSrc: PropTypes.string.isRequired,
    descriptionHtml: PropTypes.node.isRequired,
    nextVideo: PropTypes.shape({
        link: PropTypes.string,
        text: PropTypes.string
    }),
    previousVideo: PropTypes.shape({
        link: PropTypes.string,
        text: PropTypes.string
    })
};

export default VideoPage;