import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function recentActivity(
	parent: any,
	args: null,
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const task = ogm.model('Task');
	const user = ogm.model('User');
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
	
	/**
	 * TODO: FIND A WAY TO GET ALL TASKS THAT HAS BEEN UPDATED UNDER THE LAST 24 HOURS.
	 *     + GET ALL THE INVITATIONS
	 *    => MAP ALL THIS RECORDS INTO AN ARRAY AND RETURNS IT.
	 */

	const [ projects ] = await project.find({
		where: {
			contributors: {
				id: token.sub
			}
		},
		selectionSet: '{tasks {name, updatedAt, updatedBy, oldState, state}}',
		options: {
			limit: 10
		}
	});
	const tasks = projects.tasks
			.map((t: any) => ({
				type: "TASK_STATE_CHANGED",
				data: {
					name: t.name,
					createdBy: t.updatedBy, 
					createdAt: t.updatedAt, 
					oldState: t.oldState, 
					state: t.state
				}
			}));

	const [ users ] = await user.find({
		where: {
			id: token.sub
		},
		selectionSet: '{invitations {createdAt, from {username}, project {name}}}',
		options: {
			limit: 10
		}
	});

	const invitations = users.invitations
		.map((i: any) => ({
			type: "PROJECT_INVITATION",
			data: {
				createdAt: i.createdAt,
				username: i.from.username,
				projectname: i.project.name
			}
		}))

	const activities = [
		...tasks,
		...invitations
	].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

	return {
		status: 'Recent activities successfully fetched.',
		data: activities
	}
}

const resolvers = {
	Query: {
		recentActivity
	}
};

export default resolvers;
