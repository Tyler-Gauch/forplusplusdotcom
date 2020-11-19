/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getQuiz = /* GraphQL */ `
  query GetQuiz($id: ID!) {
    getQuiz(id: $id) {
      id
      videoId
      questions {
        ... on MultipleChoiceQuestion {
          type
          question
          answer
          options
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listQuizs = /* GraphQL */ `
  query ListQuizs(
    $filter: ModelQuizFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuizs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        videoId
        questions {
          ... on MultipleChoiceQuestion {
            type
            question
            answer
            options
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
