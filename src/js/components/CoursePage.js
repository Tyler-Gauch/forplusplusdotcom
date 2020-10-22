import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import VideoPage from './VideoPage';

const CoursePage = ({id, title, videos, description}) => {
    let match = useRouteMatch();

    return (
        <Fragment>
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
        </Fragment>
    );
};

CoursePage.propTypes = {
    
};

export default CoursePage;