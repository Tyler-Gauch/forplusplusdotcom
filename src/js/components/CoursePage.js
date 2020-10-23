import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CoursePage = ({id, title, videos, description}) => {
    return (
        <>
            <Row>
                <h4>{title}</h4>
            </Row>
            <Row>
                <p>{description}</p>
            </Row>
            <Row>
                <ul>
                    {videos.map(video => (
                        <li><Link to={`/course/${id}/${video.id}`}>{video.title}</Link></li>
                    ))}
                </ul>
            </Row>
        </>
    );
};

CoursePage.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    videos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired   
    }))
};

export default CoursePage;