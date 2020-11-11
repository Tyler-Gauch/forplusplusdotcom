import React from 'react';
import { Jumbotron, Row, Col } from 'react-bootstrap';
import { verifyUserIsAdmin } from '../../util/user';
import VideoPreview from '../VideoPreview';

const NonEditableCoursePage = ({course, user}) => {

    return (
        <>
            <Row>
                <Col>
                    <Jumbotron>
                        <h1>{course.title}</h1>
                        <p>{course.description}</p>
                    </Jumbotron>
                </Col>
            </Row>

            <Row gutter>
                {course.videos.map(video => {
                    if ((course.adminOnly || video.adminOnly) && !verifyUserIsAdmin(user)) {
                        return;
                    }
                
                    return (<Col lg={3}>
                        <VideoPreview key={video.id} courseId={course.id} video={video} />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default NonEditableCoursePage;