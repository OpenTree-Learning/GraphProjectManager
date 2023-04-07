import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function createProject(
	parent: any,
	args: { name: string, description: string },
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const project = ogm.model('Project');
	let token;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string);
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	const { projects } = await project.create({
		input: [
			{
				name: args.name,
				description: args.description,
				contributors: {
					connect: {
				        	where: {
				        		node:  {
								id: token.sub
				      			}
				    		},
						edge: {
							as: "OWNER"
						}
				  	}
				}
			}
		]
	});

	return {
		status: 'Project successfully created.',
		data: projects[0]
	};
}

const resolvers = {
	Mutation: {
		createProject
	}
};


export default resolvers;
