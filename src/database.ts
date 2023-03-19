import * as neo4j from 'neo4j-driver';


function createSession (username: string, password: string): neo4j.Session {
	const driver = neo4j.driver(
		'neo4j://localhost', 
		neo4j.auth.basic(username, password)
	);

	return driver.session();
}

export default createSession;
