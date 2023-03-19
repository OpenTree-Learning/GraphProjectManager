import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer, gql } from 'apollo-server';
import * as neo4j from 'neo4j-driver';

import Project from '../types/project.schema';
import Task from '../types/task.schema';
import User from '../types/user.schema';


async function createServer (username: string, password: string): Promise<ApolloServer> {
	const typeDefs = gql`
		${Project},
		${Task},
		${User}
	`;
	

	const driver = neo4j.driver(
		'neo4j://localhost', 
		neo4j.auth.basic(username, password)
	);

	const neoSchema = new Neo4jGraphQL({typeDefs, driver});
	const schema = await neoSchema.getSchema();
	const server = new ApolloServer({schema: schema});

	return Promise.resolve(server);
}

export default createServer;
