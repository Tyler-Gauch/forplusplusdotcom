/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse {
    onCreateCourse {
      id
      title
      description
      shortDescription
      videos {
        id
        title
        thumbnailUrl
        videoSrc
        previousVideo {
          otherVideoId
          text
        }
        nextVideo {
          otherVideoId
          text
        }
        description
        adminOnly
      }
      adminOnly
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse {
    onUpdateCourse {
      id
      title
      description
      shortDescription
      videos {
        id
        title
        thumbnailUrl
        videoSrc
        previousVideo {
          otherVideoId
          text
        }
        nextVideo {
          otherVideoId
          text
        }
        description
        adminOnly
      }
      adminOnly
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse {
    onDeleteCourse {
      id
      title
      description
      shortDescription
      videos {
        id
        title
        thumbnailUrl
        videoSrc
        previousVideo {
          otherVideoId
          text
        }
        nextVideo {
          otherVideoId
          text
        }
        description
        adminOnly
      }
      adminOnly
      createdAt
      updatedAt
    }
  }
`;
