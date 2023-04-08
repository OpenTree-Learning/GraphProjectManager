import * as neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { MutationResponse } from './types';
import { verifyJwt } from '../utils/jwt_verify.utils';


const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

function hashPassword(saltRounds: number, password: string): string {
	const salt = bcrypt.genSaltSync(saltRounds);

	return bcrypt.hashSync(password, salt);
}	

async function createUser(
	parent: any, 
	args: { username: string, firstname: string, lastname: string, email: string, password: string }, 
	context: Context
): Promise<MutationResponse> {
	const { ogm }: { ogm: OGM<any> } = context;
	const user = ogm.model('User');

	const matchingUser = await user.find({
		where: {
			email: args.email
		}
	});

	if (matchingUser.length > 0) {
		return {
			status: 'User already exists',
			data: null
		};
	}

	if (!passwordRegex.test(args.password)) {
		return {
			status: 'Password must contain at least one letter, one number and one special character.',
			data: null
		};
	}

	const { users } = await user.create({
		input: [
			{
				username: args.username, 
				firstname: args.firstname,
				lastname: args.lastname,
				email: args.email, 
				password: hashPassword(10, args.password), 
			}
		]
	});

	return {
		status: 'User successfully created',
		data: users[0]
	};
}

async function updateUser(
	parent: any, 
	args: { username: string, firstname: string, lastname: string, email: string, password: string }, 
	context: Context
): Promise<MutationResponse> {
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

	if (args.password) {
		if (!passwordRegex.test(args.password)) {
			return {
				status: 'Password must contain at least one letter, one number and one special character.',
				data: null
			};
		}

		args.password = hashPassword(10, args.password);
	}

	const { users } = await user.update({
		where: {
			id: token.sub
		},
		update: args
	});

	return {
		status: 'User successfully updated.',
		data: users[0]
	};
}

async function auth(
	parent: any, 
	args: { email: string, password: string }, 
	context: Context
) {
	const invalidIDs = 'Invalid email or password.';
	const { ogm }: { ogm: OGM<any> } = context;
	const user = ogm.model('User');

	const [ matchingUser ] = await user.find({
		where: {
			email: args.email
		}
	});

	if (!matchingUser) {
		return {
			status: invalidIDs,
			data: null
		};
	}

	const { password } = matchingUser;

	if (!bcrypt.compareSync(args.password, password)) {
		return {
			status: invalidIDs,
			data: null
		};
	}

	return {
		status: 'User successfully authenticated.',
		data: jwt.sign({ sub: matchingUser.id }, process.env.JWT_SECRET as string)
	};
}

async function projectAuth(
	parent: any, 
	args: { id: string }, 
	context: Context
) {
	const { ogm }: { ogm: OGM<any> } = context;
	const user = ogm.model('User');
	const secret: string = process.env.JWT_SECRET as string;
	let token;

	try {
		token = await verifyJwt(context, secret);
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	const [ users ] = await user.find({
		where: {
			projects: {
				id: args.id
			}
		},
		selectionSet: '{projectsConnection {edges {as}}}'
	});

	if (!users) {
		return {
			status: 'Project does not exist.',
			data: null
		};
	}

	const [ role ] = users.projectsConnection.edges;
	const roleTokenPayload = {
		sub: token.sub,
		roles: role.as
	};
	const roleToken = jwt.sign(roleTokenPayload, secret);

	return {
		status: 'User successfully authenticated to the project.',
		data: roleToken
	};
}


const resolvers = {
	Mutation: {
		createUser,
		updateUser,
		auth,
		projectAuth
	}
};


export default resolvers;
