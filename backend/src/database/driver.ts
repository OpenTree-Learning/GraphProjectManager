import * as neo4j from 'neo4j-driver';


function createDriver (username: string, password: string): neo4j.Driver {
	const driver = neo4j.driver(
		'neo4j://localhost', 
		neo4j.auth.basic(username, password)
	);

	return driver
}

export default createDriver;
