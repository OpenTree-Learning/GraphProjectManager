import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { ProjectAuthJwt } from './types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function commit(
	parent: any,
	args: { taskId: string, state: string },
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const user = ogm.model('User');
	const task = ogm.model('Task');
	let token: ProjectAuthJwt;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string) as ProjectAuthJwt;
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	if (!token.sub || !token.roles || !token.project_id) {
		return {
			status: 'Unexpected JWT payload.',
			data: null
		};
	}

	const [ author ] = await user.find({
		where: { id: token.sub }, selectionSet: '{ username }'
	});

	const [ currentTask ] = await task.find({
		where: { id: args.taskId }, selectionSet: '{ state }'
	});

	if (!currentTask) {
		return {
			status: 'Task not found.',
			data: null
		};
	}

	const { tasks } = await task.update({
		where: {
			id: args.taskId
		},
		update: {
			state: args.state,
			oldState: currentTask.state,
			updatedBy: author.username,
		}
	});	

	return {
		status: 'Progress commited successfully',
		data: tasks[0]
	};
}

const resolvers = {
	Mutation: {
		commit
	}
};

export default resolvers;
