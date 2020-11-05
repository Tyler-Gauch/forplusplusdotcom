import store from '../store/store';
import { API, graphqlOperation } from 'aws-amplify';
import { getCourse } from '../../graphql/queries';
import { addOrUpdateCourses } from '../store/actions';

export const addVideoAfter = (course, afterVideoId, newVideo) => {
    const newCourse = {...course};

    if (!newCourse || !newCourse.videos) {
        console.error("Course null or doesn't have any videos", course);
        return null;
    }

    const afterVideo = newCourse.videos.find(video => {
        return video.id === afterVideoId;
    });

    if (!afterVideo) {
        console.error(`Can't find video ${afterVideoId} in course`, course);
        return null;
    }

    const afterVideoIndex = newCourse.videos.indexOf(afterVideo);

    const beforeVideos = newCourse.videos.slice(0, afterVideoIndex+1);
    const afterVideos = afterVideoIndex !== newCourse.videos.length - 1 ? newCourse.videos.slice(afterVideoIndex+1) : [];

    newVideo.nextVideo = afterVideo.nextVideo;

    beforeVideos[beforeVideos.length-1].nextVideo = {
        otherVideoId: newVideo.id,
        text: newVideo.title
    };

    newVideo.previousVideo = {
        otherVideoId: afterVideo.id,
        text: afterVideo.title
    };

    if (afterVideos.length > 0) {
        afterVideos[0].previousVideo = {
            otherVideoId: newVideo.id,
            text: newVideo.title
        };
    }

    newCourse.videos = beforeVideos.concat(newVideo).concat(afterVideos);

    return newCourse;
}

export const removeVideo = (course, videoId) => {
    debugger;
    const newCourse = {...course};

    if (!newCourse.videos || newCourse.videos.length === 0) {
        return null;
    }

    const removedVideo = newCourse.videos.find(video => {return video.id === videoId;});
    const removedVideoIndex = newCourse.videos.indexOf(removedVideo);

    if (!removedVideo) {
        console.error("Couldn't find video to delete");
        return null;
    }

    const beforeVideos = newCourse.videos.slice(0, removedVideoIndex);
    const afterVideos = removedVideoIndex !== newCourse.videos.length - 1 ? newCourse.videos.slice(removedVideoIndex+1) : [];

    if (beforeVideos.length > 0) {
        beforeVideos[beforeVideos.length-1].nextVideo = removedVideo.nextVideo;
    }

    if (afterVideos.length > 0) {
        afterVideos[0].previousVideo = removedVideo.previousVideo;
    }

    newCourse.videos = beforeVideos.concat(afterVideos);
    return newCourse;
}

export const appendVideo = (course, newVideo) => {
    const newCourse = {...course};

    if (!newCourse.videos || newCourse.videos.length === 0) {
        newCourse.videos = [newVideo];
        return newCourse;
    }

    const lastVideoId = newCourse.videos[newCourse.videos.length - 1].id;
    return addVideoAfter(newCourse, lastVideoId, newVideo);
}

export const loadWantedCourse = (courseId) => {
    return new Promise((resolve, reject) => {
        const state = store.getState();

        const wantedCourse = state.courses.find(c => c.id === courseId);

        if (wantedCourse) {
            resolve(wantedCourse);
        } else {
            API.graphql({...graphqlOperation(getCourse, {id: courseId}), authMode: "API_KEY"})
                .then(response => {
                    addOrUpdateCourses([response.data.getCourse]);
                    resolve(response.data.getCourse);
                })
                .catch(reject);
        }
    });
}