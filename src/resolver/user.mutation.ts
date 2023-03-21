import * as neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import { Context } from '../types';
import { MutationResponse } from './types';


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
	const driver: neo4j.Driver = context.driver;
	const usersWithEmail = await getUserBy({email: args.email}, driver)

	if (usersWithEmail.length > 0) {
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

	const result = await driver.executeQuery(`
		create (u:User {
			id: apoc.create.uuid(),
			username: $username, 
			firstname: $firstname,
			lastname: $lastname,
			email: $email, 
			password: $password, 
			createdAt: datetime(), 
			updatedAt: datetime()
		 }) return u
		`, {
			...args,
			password: hashPassword(10, args.password)
		}
	);

	return createResponse(result, 'User successfully created');
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
				status: 'Email already taken',
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
	const query = `match (u:User {id: $id})\n${setQuery}\nreturn u`;

	const result = await driver.executeQuery(query, args);

	return createResponse(result, 'User successfully updated!');
}


const resolvers = {
	Mutation: {
		createUser,
		updateUser
	}
}


export default resolvers
