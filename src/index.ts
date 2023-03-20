import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server';
import { loadFiles } from 'graphql-import-files';

import loadDatabaseSecrets from './database/secret';
import createDriver from './database/driver';
import resolvers from './resolver';
import { Context } from './types';


loadDatabaseSecrets()
.then(async () => {
	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const driver = createDriver(username, password);
	const typeDefs = loadFiles('**/graphql/*.graphql')

	const neoSchema = new Neo4jGraphQL({
		typeDefs,
		resolvers,
		driver
	});
	const schema = await neoSchema.getSchema();
	const server = new ApolloServer({
		schema, 
		context: () => ({ driver } as Context)
	});

	
	server.listen().then(({ url }) => {
		console.log(`🚀 Server ready at ${url}`);
	})
})
