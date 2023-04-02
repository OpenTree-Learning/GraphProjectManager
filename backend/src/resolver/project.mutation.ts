import { Context  } from '../types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function createProject(
	parent: any,
	args: { name: string, description: string },
	context: Context
) {
	let token;
	const { driver } = context;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string);
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	const query = `
		MATCH (u:User {id: $jwt})
		CREATE (p:Project {
			id: apoc.create.uuid(),
			name: $name, 
			description: $description,
			createdAt: datetime()
		})
		CREATE (u)-[r:CONTRIBUTES {as: "OWNER", since: datetime()}]->(p)
		RETURN p
	`
	const parameters = {
		jwt: token.sub,
		...args,
	}
	let response;

	try {
		response = await driver.executeQuery(query, parameters);
	} catch (err: any) {
		return {
			status: 'Failed to create project.',
			data: null
		};
	}

	return {
		status: 'Project successfully created.',
		data: response.records[0].get('p').properties
	};
}

const resolvers = {
	Mutation: {
		createProject
	}
};


export default resolvers;
