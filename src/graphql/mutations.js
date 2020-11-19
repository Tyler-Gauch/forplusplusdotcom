/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createQuiz = /* GraphQL */ `
  mutation CreateQuiz(
    $input: CreateQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    createQuiz(input: $input, condition: $condition) {
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
export const updateQuiz = /* GraphQL */ `
  mutation UpdateQuiz(
    $input: UpdateQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    updateQuiz(input: $input, condition: $condition) {
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
export const deleteQuiz = /* GraphQL */ `
  mutation DeleteQuiz(
    $input: DeleteQuizInput!
    $condition: ModelQuizConditionInput
  ) {
    deleteQuiz(input: $input, condition: $condition) {
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
