import { gql } from "@apollo/client";


export const PROJECT_GRAPH = gql`
  query ProjectGraph {
    projectGraph {
      edges {
        source
        target
      }
      nodes {
        __typename
        ... on PNode {
          id
          name
          description
          createdAt
        }
        ... on TNode {
          id
          name
          description
          updatedBy
          labels
          priorityOrder
          state
          oldState
          createdAt
          updatedAt
        }
        ... on UNode {
          id
          username
          firstname
          lastname
          email
          createdAt
          updatedAt
        }
      }
    }
  }
`;
