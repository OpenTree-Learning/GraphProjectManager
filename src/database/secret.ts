import vault from 'node-vault';
import * as dotenv from 'dotenv';


async function unseal (client: vault.client, keys: Array<string>, shares: number, threshold: number): Promise<void> {
	for (let i = 0; i < threshold; i++) {
		await client.unseal({
			secret_shares: shares,
			secret_threshold: threshold,
			key: keys[i]
		});
	}
}

async function loadDatabaseSecrets (): Promise<void> {
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

	const {data} = await client.read('kv/data/db');

	process.env['DATABASE_USERNAME'] = data.data.USERNAME;
	process.env['DATABASE_PASSWORD'] = data.data.PASSWORD;
}


export default loadDatabaseSecrets;
