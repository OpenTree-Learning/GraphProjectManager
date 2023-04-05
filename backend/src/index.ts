import { Neo4jGraphQL } from '@neo4j/graphql';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer } from 'apollo-server';
import { loadFiles } from 'graphql-import-files';
import * as express from 'express';
import * as neo4j from 'neo4j-driver';

import loadSecrets from './database/secret';
import createDriver from './database/driver';
import resolvers from './resolver';
import { Context, NodeEnv } from './types';
import * as dotenv from 'dotenv';
import logger from './logger';
import path from 'path';


const nodeEnv = process.env.NODE_ENV;
const envFilePath = (ext: string): string => path.resolve(process.cwd(), `.env.${ext}`);


if (nodeEnv === NodeEnv.DEVELOPMENT) {
	dotenv.config({path: envFilePath('dev')});
	startServer();
} else if (nodeEnv === NodeEnv.PRODUCTION) {
	dotenv.config({path: envFilePath('prod')});
	loadSecrets().then(startServer);
}


async function startServer () {
	logger.info('Connecting to database...');

	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const driver = await createDriver(username, password);
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
		logger.info('\n\n');
		logger.info(`🚀 Server ready at ${url} 🚀 `);
	});
}
