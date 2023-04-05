import * as neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { Context  } from '../types';
import { MutationResponse } from './types';
import { BasicQuery } from '../utils/query.utils';
import {OGM} from '@neo4j/graphql-ogm';
import logger from '../logger';


const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/


async function getUserBy(by: any, driver: neo4j.Driver): Promise<any> {
	const matchQuery = Object.keys(by).map(k => `${k}: $${k}`).join(',');
	
	const query = `match (u:User {${matchQuery}}) return u`;
	const { records } = await driver.executeQuery(query, by);

	return records;
}

function hashPassword(saltRounds: number, password: string): string {
	const salt = bcrypt.genSaltSync(saltRounds);

	return bcrypt.hashSync(password, salt);
}	

function createResponse(dbResult: any, status: string) {
	const user = dbResult.records[0].get('u');

	return {
		status: status,
		data: {
			id: user.elementId,
			...user.properties
		}
	};
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
	args: { id: string, username: string, firstname: string, lastname: string, email: string, password: string }, 
	context: Context
): Promise<MutationResponse> {

	const driver: neo4j.Driver = context.driver;

	if (args.email) {
		const usersWithEmail = await getUserBy({email: args.email}, driver)

		if (usersWithEmail.length > 0) {
			return {
				status: 'Email already taken.',
				data: null
			};
		}
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

	const setQuery = Object.keys(args).map(k => `set u.${k} = $${k}`).join('\n');
	const query = `MATCH (u:User {id: $id})\n${setQuery}\nRETURN u`;

	const result = await driver.executeQuery(query, args);

	return createResponse(result, 'User successfully updated!');
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
		data: jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string)
	};
}

async function projectAuth(
	parent: any, 
	args: { id: string }, 
	context: Context
) {
	const authHeader = context.req.get('Authorization');

	if (!authHeader) {
		return {
			status: 'User not authenticated.',
			data: null
		};
	}

	const token = authHeader.replace('Bearer ', '');
	const secret: string = process.env.JWT_SECRET as string;
	let decodedToken: jwt.JwtPayload | string = {};

	try {
		decodedToken = jwt.verify(token, secret);
	} catch (err) {
		return {
			status: 'Failed to verify jwt.',
			data: null
		};
	}

	const edge = await new BasicQuery(context.driver)
			.getEdges('CONTRIBUTES', ['Project', 'User'])
			.where([{id: args.id}, undefined, {id: decodedToken.sub}])
			.execute();
	
	const userRole = edge[0].properties.as;

	const roleTokenPayload = {
		sub: decodedToken.sub,
		roles: userRole
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
