import { combineReducers } from 'redux';
import { ADD_OR_UPDATE_COURSES, SET_COURSES, SET_USER, REMOVE_COURSES, SET_ADMIN_MODE } from './actions';
import User from '../util/user';
import { indexOfFromProperty } from '../util/array-helpers';

const user = (state = null, action) => {
    
    if (action.type === SET_USER) {
        let payload = action.user || null;

        if (payload != null && !(payload instanceof User)) {
            payload = new User(payload);
        }

        return payload;
    }

    return state;
}

const courses = (state = [], action) => {
    switch(action.type) {
        case SET_COURSES:
            return action.courses || [];
        case ADD_OR_UPDATE_COURSES:
            const updatedState = action.courses.reduce((currentState, course) => {
                const courseIndex = indexOfFromProperty(currentState, "id", course.id);
                if (courseIndex !== -1) {
                    // update the course
                    return [
                        ...currentState.slice(0, courseIndex),
                        course,
                        ...currentState.slice(courseIndex+1)
                    ];
                } else {
                    return currentState.concat([course]);
                }
            }, state);

            return updatedState;
        case REMOVE_COURSES:
            debugger;
            return state.filter(course => action.courses.indexOf(course) !== -1);   
    }

    return state;
}

const adminMode = (state = false, action) => {
    if (action.type === SET_ADMIN_MODE) {
        return action.adminMode;
    }

    return state;
}

const reducers = combineReducers({
    user,
    courses,
    adminMode
});

export default reducers;