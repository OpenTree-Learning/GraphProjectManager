import * as neo4j from 'neo4j-driver';
import { NodeTypes, EdgeTypes } from './types';


//export async function getNodesBy(args: { type: NodeTypes, by: any, driver: neo4j.Driver }): Promise<any> {
//	const { type, by, driver } = args;
//
//	if (!Object.values(NodeTypes).includes(type)) {
//		return []
//	}
//
//	const match: string = Object.keys(by)
//		.map(key => `${key}: $${key}`)
//		.join(',');
//	const query: string = `MATCH (n:${type} {${match}}) RETURN n`;
//	const { records } = await driver.executeQuery(query, by);
//
//	if (records.length === 0) {
//		return [];
//	}
//
//	return records.map(record => record.get('n').properties);
//}


type Where = any | [any?, any?, any?]
type SerializedWhere = string | [string?, string?, string?]

interface Query {
	serializedWhere: SerializedWhere,
	where: Where
}

interface NodeQuery extends Query { 
	node: NodeTypes 
}

interface EdgeQuery extends Query { 
	nodes: [NodeTypes, NodeTypes],
	edge: EdgeTypes 
}

export class BasicQuery {


	private driver: neo4j.Driver;
	private nodeQuery: NodeQuery;
	private edgeQuery: EdgeQuery;
	private query: string;

	constructor (driver: neo4j.Driver) {
		this.driver = driver;
		this.nodeQuery = {} as NodeQuery;
		this.edgeQuery = {} as EdgeQuery;
		this.query = '';
	}

	private isNodeQuery (): boolean {
		return Object.keys(this.nodeQuery).length > 0 && Object.keys(this.edgeQuery).length === 0;
	}

	private isEdgeQuery (): boolean {
		return Object.keys(this.nodeQuery).length === 0 && Object.keys(this.edgeQuery).length > 0;
	}

	public getNodes (type: NodeTypes): BasicQuery {
		this.nodeQuery = {
			node: type
		} as NodeQuery;

		return this;
	}

	public getEdges (type: EdgeTypes, nodesTypes: [NodeTypes, NodeTypes]): BasicQuery {
		this.edgeQuery = {
			edge: type,
			nodes: nodesTypes
		} as EdgeQuery;

		return this;
	}

	public where (where: Where): BasicQuery {
		const serialize = (w: any): string => {
			const result =  Object.keys(w)
				.map(key => `${key}: $${key}`)
				.join(',');

			return `{${result}}`;
		}

		if (this.isNodeQuery()) {
			this.nodeQuery.where = where;
			this.nodeQuery.serializedWhere = serialize(where);
		} else if (this.isEdgeQuery()) {
			// @ts-ignore
			this.nodeQuery.where = ({...where[0], ...where[1], ...where[2]}) as Where;
			this.edgeQuery.serializedWhere = where.map(serialize);
		}

		return this;
	}

	public async execute (): Promise<any> {
		let query = '';
		let where = {};

		if (this.isNodeQuery()) {
			query = `MATCH (n:${this.nodeQuery.node} ${this.nodeQuery.serializedWhere}) RETURN n`
			where = this.nodeQuery.where;
		} else if (this.isEdgeQuery()) {
			const {nodes, edge, serializedWhere} = this.edgeQuery;
			const [wA, wEdge, wB] = serializedWhere;

			query = `MATCH (a:${nodes[0]} ${wA})-[r:${edge} ${wEdge}]-(b:${nodes[1]} ${wB}) RETURN n`;
		}

		const { records } = await this.driver.executeQuery(query, where);

		if (records.length === 0) {
			return [];
		}

		return records.map((record: any) => record.get('n').properties);
	}
}
