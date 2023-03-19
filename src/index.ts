import loadDatabaseSecrets from './secret';
import createSession from './database';


loadDatabaseSecrets()
.then(() => {
	const username = process.env.DATABASE_USERNAME as string;
	const password = process.env.DATABASE_PASSWORD as string;

	const session = createSession(username, password);

	session.run("match (p:Project) where p.name = 'GraphProjectManager' return p")
	.then(result => {
		result.records.forEach(record => console.log(record.get('p')));
	})
	.catch(error => {
		console.log('error');
		console.log(error);
	});
})
