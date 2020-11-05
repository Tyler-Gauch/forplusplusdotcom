/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
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
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        shortDescription
        videos {
          id
          title
          thumbnailUrl
          videoSrc
          description
          adminOnly
        }
        adminOnly
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
