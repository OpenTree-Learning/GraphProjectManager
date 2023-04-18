import { OGM } from '@neo4j/graphql-ogm';

import { Context  } from '../types';
import { ProjectAuthJwt } from './types';
import { verifyJwt } from '../utils/jwt_verify.utils';


async function projectGraph(
	parent: any,
	args: { },
	context: Context
) {
	const { driver } = context; 
	let token: ProjectAuthJwt;

	try {
		token = await verifyJwt(context, process.env.JWT_SECRET as string) as ProjectAuthJwt;
	} catch (err: any) {
		return {
			status: err.message,
			data: null
		};
	}

	if (!token.sub || !token.roles || !token.project_id) {
		return {
			status: 'Unexpected JWT payload.',
			data: null
		};
	}

	const edgeRes = await driver.executeQuery(`
		MATCH (p1:Project {id: $id})-[c1:DEPENDS_ON]-(t1:Task)
		RETURN { source: startNode(c1).id, target: endNode(c1).id } AS edges
		UNION
		MATCH (p1:Project {id: $id})-[:DEPENDS_ON*]-(t1:Task)-[:DEPENDS_ON]-(t2:Task)
		RETURN { source: t1.id, target: t2.id } AS edges
		UNION
		MATCH (p1:Project {id: $id})-[:DEPENDS_ON*]-(t1:Task)-[:CONTRIBUTES]-(u:User)
		RETURN { source: t1.id, target: u.id } AS edges
	`, 
		{ id: token.project_id }
	);

	const nodeRes = await driver.executeQuery(`
		MATCH (p:Project {id: $id})-[:DEPENDS_ON*]-(t:Task)
		MATCH (p2:Project {id: $id})-[:DEPENDS_ON*]-(t2:Task)-[:CONTRIBUTES]-(u:User)
		RETURN collect(DISTINCT p)+collect(t)+collect(DISTINCT u) AS nodes
       `,
	       { id: token.project_id }
	);
	
	const nodes = nodeRes.records.map(r => r.get('nodes')).flat().map(n => n.properties);
	const edges = edgeRes.records.map(r => r.get('edges'));

	return {
	       nodes,
	       edges
	};
}

const resolvers = {
	Query: {
		projectGraph
	}
};

export default resolvers;
