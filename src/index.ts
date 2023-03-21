import { Neo4jGraphQL } from '@neo4j/graphql';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer } from 'apollo-server';
import { loadFiles } from 'graphql-import-files';
import * as express from 'express';

import loadSecrets from './database/secret';
import createDriver from './database/driver';
import resolvers from './resolver';
import { Context } from './types';
import logger from './logger';


logger.info('Server starting...');
loadSecrets()
.then(async () => {
	logger.info('Secrets unsealed!');
	logger.info('Connecting to database...');

	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const driver = createDriver(username, password);
	const typeDefs = loadFiles('**/graphql/*.graphql')

	const neoSchema = new Neo4jGraphQL({
		typeDefs,
		resolvers,
		driver,
		plugins: {
			auth: new Neo4jGraphQLAuthJWTPlugin({
				secret: process.env.JWT_SECRET as string
			})
		}
	});
	const schema = await neoSchema.getSchema();
	const server = new ApolloServer({
		schema, 
		context: ({ req }: { req: express.Request }): Context => {
			return {
				req,
				driver
			};
		}
	});

	logger.info('Connected to database!');

	server.listen().then(({ url }) => {
		logger.info(`🚀 Server ready at ${url}`);
	})
})
