export const SET_USER = 'SET_USER';
export const SET_COURSES = 'SET_COURSES';
export const ADD_COURSES = 'ADD_COURSES';

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

export const addCourses = (courses) => {
    return {
        type: ADD_COURSES,
        courses
    }
}