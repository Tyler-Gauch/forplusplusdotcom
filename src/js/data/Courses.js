import React, {Fragment} from 'react';

export const COD_UNIVERSITY = {
    id: "cod_university",
    title: "Call of Duty University",
    description: "Seeing how we don't have any programming content yet here are a few video lessons on how to get better at Call of Duty! These videos will get moving, shooting, and playing like a pro with just a few simple tricks!.",
    videos: [
        {
            id: "best-warzone-settings",
            title: "COD University: The best settings for warzone",
            videoSrc: "https://www.youtube.com/embed/MSwhpyKseRE",
            nextVideo: {
                link: "/course/cod_university/how-to-move-like-a-pro",
                text: "Next: How to move"
            },
            descriptionHtml: (
                <Fragment>
                    Today we are going to talk about the best settings in warzone!
                </Fragment>
            )
        },
        {
            id: "how-to-move-like-a-pro",
            title: "COD University: How to move like a pro!",
            videoSrc: "https://www.youtube.com/embed/0ugRgDIw0Ow",
            previousVideo: {
                link: "/course/cod_university/best-warzone-settings",
                text: "Previous: Best Warzone Settings"
            },
            nextVideo: {
                link: "/course/cod_university/how-to-aim-like-a-pro",
                text: "Next: How to aim"
            },
            descriptionHtml: (
                <Fragment>
                    <p>Today we are going over the top 3 basic movements to get you moving like a pro, slide cancelling, bunny hopping, and centering!</p>
                </Fragment>
            )
        },
        {
            id: "how-to-aim-like-a-pro",
            title: "COD University: How to aim like a pro!",
            videoSrc: "https://www.youtube.com/embed/0ugRgDIw0Ow",
            previousVideo: {
                link: "/course/cod_university/how-to-move-like-a-pro",
                text: "Previous: How to move"
            },
            descriptionHtml: (
                <Fragment>
                    Hey everyone! In this video you get 2 drills that will help show you how to practice and hone in your accuracy and recoil control, while working on your movement, to get you moving and shooting like a call of duty pro in no time!
                </Fragment>
            )
        }
    ]
};


export const COURSES = [
    COD_UNIVERSITY
];