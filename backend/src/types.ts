import * as express from 'express';
import * as neo4j from 'neo4j-driver';


export interface Context {
	req: express.Request,
	driver: neo4j.Driver
};
