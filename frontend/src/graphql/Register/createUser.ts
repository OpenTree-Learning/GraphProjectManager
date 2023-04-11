import { gql } from '@apollo/client';


export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $firstname: String, $lastname: String) {
    createUser(username: $username, email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
      status
      data {
        username
        firstname
        lastname
        email
        createdAt
        updatedAt
      }
    }
  }
`;
