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
    MATCH (p1:Project {id: "c850ed1e-4f78-4919-b836-3df3a8b9b588"})-[c1:DEPENDS_ON]-(t1:Task)
    RETURN { id: id(c1), source: startNode(c1).name, target: endNode(c1).name } AS edges
    UNION
    MATCH (p1:Project {id: "c850ed1e-4f78-4919-b836-3df3a8b9b588"})-[:DEPENDS_ON*]-(t1:Task)-[c2:DEPENDS_ON]-(t2:Task)
    RETURN { id: id(c2), source: t1.name, target: t2.name } AS edges
    UNION
    MATCH (p1:Project {id: "c850ed1e-4f78-4919-b836-3df3a8b9b588"})-[:DEPENDS_ON*]-(t1:Task)-[c3:CONTRIBUTES]-(u:User)
    RETURN { id: id(c3), source: t1.name, target: u.username } AS edges
	`, 
		{ id: token.project_id }
	);

	const nodeRes = await driver.executeQuery(`
    MATCH (p:Project {id: "c850ed1e-4f78-4919-b836-3df3a8b9b588"})
    MATCH (p)-[:DEPENDS_ON*]->(t:Task)
    OPTIONAL MATCH (t)-[:CONTRIBUTES]-(u:User)
    RETURN collect(DISTINCT p)+collect(t)+collect(u) AS nodes
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
