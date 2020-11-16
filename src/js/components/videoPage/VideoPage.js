import React, { useEffect, useState } from 'react';
import '../../../css/components/VideoPage.scss';
import { connect } from 'react-redux';
import NotFound from '../errors/NotFound';
import { loadWantedVideo } from '../../util/course-helpers';
import { verifyUserIsAdmin } from '../../util/user';
import Unknown from '../errors/Unknown';
import EditableVideoPage from './EditableVideoPage';
import NonEditableVideoPage from './NonEditableVideoPage';

const mapStateToProps = state => {
    const user = state.user || null;
    const adminMode = state.adminMode || false;
    return {user, adminMode};
};

const VideoPage = ({match, user, adminMode}) => {

    const [course, setCourse] = useState(null);
    const [video, setVideo] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [unknownError, setUnknownError] = useState(false);

    const handleSetCouseAndVideo = ({course, video}) => {
        if ((course.adminOnly || video.adminOnly) && !verifyUserIsAdmin(user)) {
            setNotFound(true);
            return;
        }

        setNotFound(false);
        setUnknownError(false);
        setCourse(course);
        setVideo(video);
    };

    useEffect(() => {
        const wantedCourseId = match.params.courseId;
        const wantedVideoId = match.params.videoId;
        loadWantedVideo(wantedCourseId, wantedVideoId)
            .then(handleSetCouseAndVideo)
            .catch(response => {
                setNotFound(true);
            });
    }, [match]);

    const canShowVideoPage = video && !notFound && !unknownError;
    const canShowAdminMode = adminMode && verifyUserIsAdmin(user);

    return (
        <>
            {notFound && <NotFound />}
            {unknownError && <Unknown />}
            {canShowVideoPage && canShowAdminMode && 
                <EditableVideoPage course={course} video={video} />
            }
            {canShowVideoPage && !canShowAdminMode &&
                <NonEditableVideoPage course={course} video={video} />
            }
        </>
    );
};

export default connect(mapStateToProps)(VideoPage);