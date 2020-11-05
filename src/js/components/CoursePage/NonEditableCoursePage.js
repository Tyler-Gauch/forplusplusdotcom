import React from 'react';
import { Jumbotron, Row, Col } from 'react-bootstrap';
import VideoPreview from '../VideoPreview';



const NonEditableCoursePage = ({course}) => {

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
                {course.videos.map(video => (
                    <Col lg={4}>
                        <VideoPreview key={video.id} courseId={course.id} video={video} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default NonEditableCoursePage;