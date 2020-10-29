import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const CoursePreview = ({id, title, shortDescription, history}) => {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                    {shortDescription}
                    </Card.Text>
                    <Button variant="primary" onClick={() => {history.push(`/course/${id}`)}}>Details</Button>
                </Card.Body>
            </Card>
        </>
    );
};

CoursePreview.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired
};

export default withRouter(CoursePreview);