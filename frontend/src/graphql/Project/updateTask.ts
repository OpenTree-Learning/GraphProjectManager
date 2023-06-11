import { gql } from "@apollo/client";


export const UPDATE_TASKS = gql`
  mutation UpdateTasks($where: TaskWhere, $update: TaskUpdateInput) {
    updateTasks(where: $where, update: $update) {
      tasks {
        name
        description
        state
        priorityOrder
        labels
      }
    }
  }
`;
