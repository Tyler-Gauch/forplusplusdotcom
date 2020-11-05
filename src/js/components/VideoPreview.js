import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { buildVideoUrl } from '../util/url-builders';
import { connect } from 'react-redux';
import { verifyUserIsAdmin } from '../util/user';
import { DELETE } from '../constants/adminActions';

const mapStateToProps = state => {
    const adminMode = state.adminMode;
    const user = state.user;
    return {adminMode, user};
}

const createAction = (type, payload) => {
    return {type, payload};
};

const VideoPreview = ({courseId, video, adminMode, user, onAdminChange}) => {
    const history = useHistory();

    const canShowAdminMode = adminMode && verifyUserIsAdmin(user);

    return (
        <>
            <Card style={{cursor: 'pointer', width: '15rem'}}>
                <Card.Img variant="top" src={video.thumbnailUrl} onClick={() => history.push(buildVideoUrl(courseId, video.id))}/>
                <Card.Body>
                    <h5>{video.title}</h5>
                    {canShowAdminMode &&
                        <Dropdown>
                            <Dropdown.Toggle>
                                Admin Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => onAdminChange(createAction(DELETE, video))}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Card.Body>
            </Card>
        </>
    );
};

export default connect(mapStateToProps)(VideoPreview);