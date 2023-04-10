import { gql } from "@apollo/client";


export const RECENT_ACTIVITIES = gql`
	query RecentActivity {
		recentActivity {
			status
			data {
				__typename
				... on CommitActivity {
					name
					createdBy
					oldState
					state
					createdAt
				}
				... on InvitationActivity {
					id
					username
					projectname
					createdAt
				}
			}
		  }
	}
`;
