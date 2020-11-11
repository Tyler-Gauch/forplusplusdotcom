import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { buildVideoUrl } from '../util/url-builders';
import { connect } from 'react-redux';
import { verifyUserIsAdmin } from '../util/user';
import { DELETE } from '../constants/adminActions';
import { useDrop, useDrag } from 'react-dnd';
import '../../css/utils/utilities.scss';

const DRAG_TYPE = "VIDEO_PREVIEW";

const mapStateToProps = state => {
    const adminMode = state.adminMode;
    const user = state.user;
    return {adminMode, user};
}

const createAction = (type, payload) => {
    return {type, payload};
};

const VideoPreview = ({courseId, video, adminMode, user, onAdminChange, moveVideo, index}) => {
    const history = useHistory();
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: DRAG_TYPE,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            // don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // determine rectange on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // determine mouse position
            const clientOffset = monitor.getClientOffset();
            // get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveVideo(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        }
    });
    const [{ isDragging }, drag] = useDrag({
        item: { type: DRAG_TYPE, id: video.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drag(drop(ref));

    const canShowAdminMode = adminMode && verifyUserIsAdmin(user);

    const opacity = isDragging ? 0 : 1;

    return (
        <>
            <Card style={{width: '15rem', opacity}} ref={ref}>
                <Card.Img className="clickable" variant="top" src={video.thumbnailUrl} onClick={() => history.push(buildVideoUrl(courseId, video.id))}/>
                <Card.Body style={{cursor: "move"}}>
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