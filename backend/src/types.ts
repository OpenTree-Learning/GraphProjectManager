import * as express from 'express';
import * as neo4j from 'neo4j-driver';
import { OGM } from '@neo4j/graphql-ogm';

export interface Context {
	req: express.Request,
	ogm: OGM<any>,
	driver: neo4j.Driver
};

export enum NodeEnv {
	PRODUCTION = 'production',
	DEVELOPMENT = 'development'
};

export type NodeEnvType = NodeEnv.DEVELOPMENT | NodeEnv.PRODUCTION;
