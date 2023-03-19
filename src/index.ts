import loadDatabaseSecrets from './database/secret';
import createServer from './database/server';


loadDatabaseSecrets()
.then(async () => {
	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const server = await createServer(username, password);

	server.listen().then(({url}) => {
		console.log(`Server ready at ${url}`);
	});
})
