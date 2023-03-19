import loadDatabaseSecrets from './secret';


loadDatabaseSecrets()
.then(() => {
	console.log(process.env.DATABASE_USERNAME);
	console.log(process.env.DATABASE_PASSWORD);
})
