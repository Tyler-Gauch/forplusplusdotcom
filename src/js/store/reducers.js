import { combineReducers } from 'redux';
import { ADD_COURSES, SET_COURSES, SET_USER } from './actions';

const user = (state = null, action) => {
    if (action.type === SET_USER) {
        return action.user || null;
    }

    return state;
}

const courses = (state = [], action) => {
    switch(action.type) {
        case SET_COURSES:
            return action.courses || [];
        case ADD_COURSES:
            return action.courses.concat(state.courses || []);
    }

    return state;
}

const reducers = combineReducers({
    user,
    courses
});

export default reducers;