import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addOrUpdateCourses, removeCourses } from '../../store/actions';
import { loadWantedCourse } from '../../util/course-helpers';
import NotFound from '../errors/NotFound';
import Unknown from '../errors/Unknown';
import { verifyUserIsAdmin } from '../../util/user';
import EditableCoursePage from './EditableCoursePage';
import NonEditableCoursePage from './NonEditableCoursePage';
import { useParams } from 'react-router-dom';

const mapStateToProps = (state) => {
    const courses = state.courses || [];
    const user = state.user || null;
    const adminMode = state.adminMode || false;
    return {courses, user, adminMode};
};

const CoursePage = ({match, courses, user, adminMode}) => {

    const [course, setCourse] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [unknownError, setUnknownError] = useState(false);
 
    const handleSetCourse = wantedCourse => {
        if (wantedCourse.adminOnly && !verifyUserIsAdmin(user)) {
            setNotFound(true);
        }

        setNotFound(false);
        setUnknownError(false);
        setCourse(wantedCourse);
    };

    useEffect(() => {
        const wantedId = match.params.courseId;
        loadWantedCourse(wantedId)
            .then(handleSetCourse)
            .catch(setUnknownError(true));

    }, [match, courses]);

    const canShowCoursePage = course && !notFound && !unknownError;
    const canShowAdminMode = adminMode && verifyUserIsAdmin(user);

    return (
        <>
            {notFound && <NotFound/>}
            {unknownError && <Unknown/>}
            {canShowCoursePage && canShowAdminMode &&
                <EditableCoursePage course={course} />
            }
            {canShowCoursePage && !canShowAdminMode &&
                <NonEditableCoursePage course={course} />
            }
        </>
    );
};

export default connect(mapStateToProps, {removeCourses, addOrUpdateCourses})(CoursePage);