import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const CourseThumbnail = ({id, title, shortDescription, history}) => {
    return (
        <>
            <Card style={{ width: '18rem', margin: '5px'}}>
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

CourseThumbnail.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired
};

export default withRouter(CourseThumbnail);