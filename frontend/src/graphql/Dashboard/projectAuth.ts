import { gql } from "@apollo/client";


export const PROJECT_AUTH = gql`
  mutation ProjectAuth($projectAuthId: ID!) {
    projectAuth(id: $projectAuthId) {
      status
      data
    }
  }
`;
