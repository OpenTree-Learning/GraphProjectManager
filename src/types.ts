import { Neo4jGraphQL, OGM } from '@neo4j/graphql';
import * as neo4j from 'neo4j';


export interface Context {
	driver: neo4j.Driver
}
