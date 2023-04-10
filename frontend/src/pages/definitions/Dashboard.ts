export interface User {
	firstname: string,
	lastname: string,
	username: string,
}

export interface Project {
	name: string,
	description: string,
	role: string,
}

interface AbstractActivity {
	__typename: string,
	createdAt: string
}

export interface CommitActivity extends AbstractActivity {
	name: string,
	createdBy: string,
	oldState: string,
	state: string
}

export interface InvitationActivity extends AbstractActivity {
	id: string,
	username: string,
	projectname: string
}


export type Activity = CommitActivity | InvitationActivity;
export enum ActivityType {
	COMMIT = "CommitActivity",
	INVITATION = "InvitationActivity"
};

export type UserRole = "OWNER" | "MODERATOR" | "CONTRIBUTOR" | "GUEST";
