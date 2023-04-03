import { gql } from '@apollo/client';


export const AUTH = gql`
	mutation Auth($email: String!, $password: String!) {
		auth(email: $email, password: $password) {
	   		data
	    		status
	  	}
	}
`;
