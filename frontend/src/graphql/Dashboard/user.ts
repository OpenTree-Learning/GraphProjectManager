import { gql } from "@apollo/client";


export const USER = gql`
	query User($id: ID!) {
		users (
			where: {
				id: $id
			}
		) {
			username
			firstname
			lastname
			projects {
				name
				description
				role
			}
		}
	}
`;
