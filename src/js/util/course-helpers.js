import store from '../store/store';
import { API, graphqlOperation } from 'aws-amplify';
import { getCourse } from '../../graphql/queries';
import { addOrUpdateCourses } from '../store/actions';
import { indexOfFromProperty } from './array-helpers';

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

export const replaceVideo = (course, videoId, updatedVideo) => {
    const newCourse = {...course};

    if (!newCourse || !newCourse.videos) {
        console.error("Course is null or doesn't have any videos", course);
        return null;
    }

    const currentVideoIndex = indexOfFromProperty(newCourse.videos, "id", videoId);
    if (currentVideoIndex === -1) {
        console.error("Unable to find current video id in list");
        return null;
    }

    const beforeVideos = newCourse.videos.slice(0, currentVideoIndex);
    const afterVideos = currentVideoIndex !== newCourse.videos.length - 1 ? newCourse.videos.slice(currentVideoIndex+1) : [];

    newCourse.videos = beforeVideos.concat(updatedVideo).concat(afterVideos);

    return newCourse;
}

export const swapVideos = (course, videoId, otherVideoId) => {
    const video = course.videos.find(v => v.id === videoId);
    if (!video) {
        console.error("Unable to find video for id", videoId);
        return null;
    }

    const otherVideo = course.videos.find(v => v.id === otherVideoId);

    if (!otherVideo) {
        console.error("Unable to find other video for id", otherVideoId);
    }

    const doSwapLeftToRight = video.nextVideo?.otherVideoId === otherVideoId;

    if (doSwapLeftToRight) {
        return swapLeftToRight(course, video, otherVideo);
    } else {
        return swapRightToLeft(course, video, otherVideo);
    }
}

const swapRightToLeft = (course, video, otherVideo) => {
    let nextVideo = null;
    let previousVideo = null;

    video.previousVideo = otherVideo.previousVideo;
    otherVideo.previousVideo = createVideoLinkFromVideo(video);
    otherVideo.nextVideo = video.nextVideo;
    video.nextVideo = createVideoLinkFromVideo(otherVideo);
    if (video.previousVideo) {
        previousVideo = course.videos.find(v => v.id === video.previousVideo.otherVideoId);
        previousVideo.nextVideo = createVideoLinkFromVideo(video);
    }
    if (otherVideo.nextVideo) {
        nextVideo = course.videos.find(v => v.id === otherVideo.nextVideo.otherVideoId);
        nextVideo.previousVideo = createVideoLinkFromVideo(otherVideo);
    }

    const numberInLeftVideos = indexOfFromProperty(course.videos, 'id', previousVideo ? previousVideo.id : otherVideo.id);
    const rightVideoStartingIndex = indexOfFromProperty(course.videos, 'id', nextVideo ? nextVideo.id : video.id)+1;
    const leftVideos = course.videos.slice(0, numberInLeftVideos);
    const rightVideos = course.videos.slice(rightVideoStartingIndex);

    const videos = [
        ...leftVideos,
        ...(previousVideo ? [previousVideo] : []),
        video,
        otherVideo,
        ...(nextVideo ? [nextVideo] : []),
        ...rightVideos
    ]

    return {
        ...course,
        videos: videos
    };
}

const swapLeftToRight = (course, video, otherVideo) => {
    let nextVideo = null;
    let previousVideo = null;

    video.nextVideo = otherVideo.nextVideo;
    otherVideo.nextVideo = createVideoLinkFromVideo(video);
    otherVideo.previousVideo = video.previousVideo;
    video.previousVideo = createVideoLinkFromVideo(otherVideo);
    if (video.nextVideo) {
        nextVideo = course.videos.find(v => v.id === video.nextVideo.otherVideoId);
        nextVideo.previousVideo = createVideoLinkFromVideo(video);
    }
    if (otherVideo.previousVideo) {
        previousVideo = course.videos.find(v => v.id === otherVideo.previousVideo.otherVideoId);
        previousVideo.nextVideo = createVideoLinkFromVideo(otherVideo);
    }
   
    const numberInLeftVideos = indexOfFromProperty(course.videos, 'id', previousVideo ? previousVideo.id : video.id);
    const rightVideoStartingIndex = indexOfFromProperty(course.videos, 'id', nextVideo ? nextVideo.id : otherVideo.id)+1;
    const leftVideos = course.videos.slice(0, numberInLeftVideos);
    const rightVideos = course.videos.slice(rightVideoStartingIndex);

    const videos = [
        ...leftVideos,
        ...(previousVideo ? [previousVideo] : []),
        otherVideo,
        video,
        ...(nextVideo ? [nextVideo] : []),
        ...rightVideos
    ]

    return {
        ...course,
        videos: videos
    };
}

export const createVideoLinkFromVideo = (video) => {
    return {
        otherVideoId: video.id,
        text: video.title
    }
}

export const UNKNOWN_COURSE_REASON = "UNKNOWN_COURSE";
export const UNKNOWN_VIDEO_REASON = "UNKNOWN_VIDEO";

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
                .catch(response => {
                    reject({reason: UNKNOWN_COURSE_REASON, response});
                });
        }
    });
}

export const loadWantedVideo = (courseId, videoId) => {
    return new Promise((resolve, reject) => {
        loadWantedCourse(courseId)
            .then(wantedCourse => {
                const wantedVideo = wantedCourse.videos.find(v => v.id === videoId);
                if (!wantedVideo) {
                    reject({reason: UNKNOWN_VIDEO_REASON, course: wantedCourse});
                }

                resolve({course: wantedCourse, video: wantedVideo});
            }).catch(reject);
    });
}

export const isVideoAdminOnly = (course, videoId) => {
    const video = course.videos.find(v => v.id === videoId);

    if (!video) {
        return false;
    }

    return video.adminOnly;
}