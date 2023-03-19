const ProjectSchema = `
	type Project {
		type: String!
		description: String
		createdAt: DateTime!
		owner: User! @relationship(type: "OWNS", direction: IN)
		contributors: [User!]! 
			@relationship(type: "CONTRIBUTES", properties: "Contributes", direction: IN)
		tasks: [Task!]! 
			@relationship(type: "DEPENDS_ON", direction: OUT)
	}
`;


export default ProjectSchema;
