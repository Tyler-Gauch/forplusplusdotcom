export const SET_USER = 'SET_USER';
export const SET_COURSES = 'SET_COURSES';
export const ADD_OR_UPDATE_COURSES = 'ADD_OR_UPDATE_COURSES';
export const REMOVE_COURSES = 'REMOVE_COURSE';
export const SET_ADMIN_MODE = 'SET_ADMIN_MODE';

export const setUser = (user) => {
    return {
        type: SET_USER,
        user
    }
}

export const setCourses = (courses) => {
    return {
        type: SET_COURSES,
        courses
    }
}

export const addOrUpdateCourses = (courses) => {
    return {
        type: ADD_OR_UPDATE_COURSES,
        courses
    }
}

export const removeCourses = (courses) => {
    return {
        type: REMOVE_COURSES,
        courses
    }
}

export const setAdminMode = adminMode => {
    return {
        type: SET_ADMIN_MODE,
        adminMode
    }
}