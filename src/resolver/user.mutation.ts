import * as neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import { Context } from '../types';


async function createUser(
	parent: any, 
	args: { username: string, firstname: string, lastname: string, email: string, password: string }, 
	context: Context
) {
	const driver: neo4j.Driver = context.driver;
	const { records } = await driver.executeQuery(
		'match (u:User) where u.email = $email return u', 
		{
			email: args.email
		}
	);

	if (records.length > 0) {
		return {
			status: 'User already exists',
			data: null
		};
	}
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

	if (!passwordRegex.test(args.password)) {
		return {
			status: 'Password must contain at least one letter, one number and one special character.',
			data: null
		};
	}

	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hashedPassword = bcrypt.hashSync(args.password, salt);

	const result = await driver.executeQuery(
		`create (u:User {
			id: apoc.create.uuid(),
			username: $username, 
			firstname: $firstname,
			lastname: $lastname,
			email: $email, 
			password: $password, 
			createdAt: datetime(), 
			updatedAt: datetime()
		 }) return u`,
		{
			...args,
			password: hashedPassword
		}
	);
	const user = result.records[0].get('u');

	return {
		status: 'User successfully created',
		data: {
			id: user.elementId,
			...user.properties
		}
	};
}

//async function updateUser(
//	parent: any, 
//	args: { username: string, firstname: string, lastname: string, email: string, password: string }, 
//	context: Context
//) {
//}

const resolvers = {
	Mutation: {
		createUser,
		//updateUser
	}
}


export default resolvers
