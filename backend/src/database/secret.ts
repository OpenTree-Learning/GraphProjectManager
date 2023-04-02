import vault from 'node-vault';
import * as dotenv from 'dotenv';
import logger from '../logger';


async function unseal (client: vault.client, keys: Array<string>, shares: number, threshold: number): Promise<void> {
	for (let i = 0; i < threshold; i++) {
		await client.unseal({
			secret_shares: shares,
			secret_threshold: threshold,
			key: keys[i]
		});
		logger.info(`Unsealing secrets (${i + 1}/${threshold})`);
	}
}

async function loadSecrets (): Promise<void> {
	dotenv.config();

	const options = {
		apiVersion: 'v1',
		endpoint: 'https://0.0.0.0:8200',
		requestOptions: {
			strictSSL: false
		}
	};
	const client = vault(options);
	const username = process.env.VAULT_USERNAME;
	const password = process.env.VAULT_PASSWORD;
	const keys = ([1, 2, 3].map(idx => process.env[`VAULT_KEY_${idx}`])) as Array<string>;

	await unseal(client, keys, 5, 3);
	await client.userpassLogin({username, password});

	const dbSecrets = await client.read('kv/data/db');
	const jwtSecret = await client.read('kv/data/jwt_secret');

	process.env['DATABASE_USERNAME'] = dbSecrets.data.data.USERNAME;
	process.env['DATABASE_PASSWORD'] = dbSecrets.data.data.PASSWORD;
	process.env['JWT_SECRET'] = jwtSecret.data.data.SECRET;
}


export default loadSecrets;
