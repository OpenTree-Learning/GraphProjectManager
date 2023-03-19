const Task = `
	enum PriorityOrder {
		LOW,
		NORMAL,
		HIGH,
		URGENT
	}

	type Task {
		type: String!
		description: String
		createdAt: DateTime!
		duration: Duration
		labels: [String]
		priorityOrder: PriorityOrder
		primitives: [Task!]! 
			@relationship(type: "DEPENDS_ON", direction: OUT)
		contributors: [User!]! 
			@relationship(type: "CONTRIBUTES", properties: "Contributes", direction: IN)
	}
`;

export default Task;
