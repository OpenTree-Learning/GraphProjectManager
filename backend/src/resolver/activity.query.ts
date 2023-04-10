import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function recentActivity(
	parent: any,
	args: null,
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const user = ogm.model('User');
	let token;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string);
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	const [ records ] = await user.find({
		where: {
			id: token.sub
		},
		selectionSet: `{
			projects {tasks {name, updatedAt, updatedBy, oldState, state}},
			invitations {id, createdAt, from {username}, project {name}}
		}`,
		options: {
			limit: 100
		}
	});

	const [ tasks ] = records.projects;
	const commits = tasks.tasks
			.map((t: any) => ({
				name: t.name,
				createdBy: t.updatedBy, 
				createdAt: t.updatedAt, 
				oldState: t.oldState, 
				state: t.state
			}));
	
	const invitations = records.invitations
			.map((i: any) => ({
				id: i.id,
				createdAt: i.createdAt,
				username: i.from.username,
				projectname: i.project.name,
			}));

	const activities = [...commits, ...invitations]
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

	return {
		status: 'Recent activities successfully fetched',
		data: activities
	};
}

const resolvers = {
	Query: {
		recentActivity
	}
};

export default resolvers;
