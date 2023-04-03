import { gql } from "@apollo/client";


export const ME = gql`
	query Me {
		users {
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
