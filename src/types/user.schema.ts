const User = `
	type User {
		username: String!
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		createdAt: DateTime
		updatedAt: DateTime
		ownedProjects: [Project!]!
			@relationship(type: "OWNS", direction: OUT)
		contributedProjects: [Project!]!
			@relationship(type: "CONTRIBUTES", properties: "Contributes", direction: OUT)
		tasks: [Task!]!
			@relationship(type: "CONTRIBUTES", properties: "Contributes", direction: OUT)
	}

	interface Contributes @relationshipProperties {
		since: DateTime
	}
`;

export default User;
