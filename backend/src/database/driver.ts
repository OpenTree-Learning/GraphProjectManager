import * as neo4j from 'neo4j-driver';


const PORT = process.env.DB_PORT;

async function createDriver (username: string, password: string): Promise<neo4j.Driver> {
	const schema: string = 'neo4j';
	const domain: string = '172.17.0.1';
	const uri: string = `${schema}://${domain}:${PORT}`;

	const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

	return driver
}

export default createDriver;
