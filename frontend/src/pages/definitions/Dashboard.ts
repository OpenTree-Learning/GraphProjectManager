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


export type UserRole = "OWNER" | "MODERATOR" | "CONTRIBUTOR" | "GUEST"


