import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { ProjectAuthJwt } from './types';
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
					connect: {where: {node:  {id: token.sub}}, edge: {as: "OWNER"}}
				}
			}
		]
	});

	return {
		status: 'Project successfully created.',
		data: projects[0]
	};
}

async function invite(
	parent: any,
	args: { email: string, as: string },
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const invitation = ogm.model('Invitation');
	const user = ogm.model('User');
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

	const [ users ] = await user.find({
		where: {
			email: args.email
		}
	});

	if (!users) {
		return {
			status: 'User not found.',
			data: null
		};
	}

	const { invitations } = await invitation.create({
		input: {
			from: {connect: {where: {node: {id: token.sub}}}},
			to: {connect: {where: {node: {email: args.email}}}},
			project: {connect: {where: {node: {id: token.project_id}}}},
			as: args.as
		}
	});

	return {
		status: `Invitation successfully sent to ${args.email}!`,
		data: invitations[0]
	};
}

async function answerInvitation(
	parent: any,
	args: { invitationId: string, accept: boolean },
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const invitation = ogm.model('Invitation');
	const user = ogm.model('User');
	let token: ProjectAuthJwt;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string) as ProjectAuthJwt;
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	const [ invitations ] = await invitation.find({
		where: {
			id: args.invitationId
		},
		selectionSet: `{
			id
			to {id}
			project {id, name, description, createdAt}
			as
		}`
	});

	if (!invitations) {
		return {
			status: 'Invitation not found.',
			data: null
		};
	}

	await invitation.delete({
		where: {
			id: args.invitationId
		}
	});

	if (args.accept) {
		await user.update({
			where: {
				id: token.sub
			},
			update: {
				projects: {
					connect: {
						where: {node: {id: invitations.project.id}},
						edge: {as: invitations.as}
					}
				}
			}
		});
	}

	return {
		status: `Invitation successfully ${args.accept ? 'accepted' : 'refused'}`,
		data: invitations.project
	};
}


const resolvers = {
	Mutation: {
		createProject,
		invite,
		answerInvitation
	}
};

export default resolvers;
