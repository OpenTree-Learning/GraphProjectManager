import { gql } from "@apollo/client";


export const ANSWER_INVITATION = gql`
  mutation AnswerInvitation($invitationId: ID!, $accept: Boolean!) {
    answerInvitation(invitationId: $invitationId, accept: $accept) {
      status
      data {
        id
        name
        description
        createdAt
      }
    }
  }
`;
