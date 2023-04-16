import { Neo4jGraphQL } from '@neo4j/graphql';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer } from 'apollo-server';
import { loadFiles } from 'graphql-import-files';
import * as express from 'express';

import loadSecrets from './database/secret';
import createDriver from './database/driver';
import resolvers from './resolver';
import { Context, NodeEnv, NodeEnvType } from './types';
import * as dotenv from 'dotenv';
import logger from './logger';
import path from 'path';


const configExt = {
	[NodeEnv.DEVELOPMENT]: 'dev', 
	[NodeEnv.PRODUCTION]: 'prod'
};

const instance = {
	[NodeEnv.DEVELOPMENT]: () => createServer(),
	[NodeEnv.PRODUCTION]: () => loadSecrets().then(createServer)
}

const nodeEnv = process.env.NODE_ENV;

if (Object.values(NodeEnv).includes(nodeEnv as NodeEnv)) {
	const env = nodeEnv as NodeEnvType;
	const ext = `.env.${configExt[env]}`;
	const startServer = instance[env];

	dotenv.config({
		path: path.resolve(process.cwd(), ext)
	});
	startServer();
}

async function createServer () {
	logger.info('Connecting to database...');

	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const driver = createDriver(username, password);
	const typeDefs = loadFiles('**/graphql/*.graphql')
	const ogm = new OGM({ typeDefs, driver });

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

	await Promise.all([neoSchema.getSchema(), ogm.init()]).then(([schema]) => {
		const server = new ApolloServer({
			schema,
			context: ({ req }: { req: express.Request }): Context => ({
				req,
				ogm,
				driver
			})
		});

		server.listen().then(({ url }) => {
			logger.info('\n\n');
			logger.info(`🚀 Server ready at ${url} 🚀 `);
		});
	});
}
