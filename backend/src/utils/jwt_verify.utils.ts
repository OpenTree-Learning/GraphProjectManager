import * as jwt from 'jsonwebtoken';
import { Context  } from '../types';


export class JwtVerificationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "JwtVerificationError";
	}
}

export async function verifyJwt(
	context: Context,
	secret: string
): Promise<jwt.JwtPayload | string> {
	const authHeader = context.req.get('Authorization');

	if (!authHeader) {
		return Promise.reject(new JwtVerificationError("Failed to read Authorization header."));
	}

	const token = authHeader.replace('Bearer ', '');
	let decodedToken: jwt.JwtPayload | string = {} as jwt.JwtPayload;

	try {
		decodedToken = jwt.verify(token, secret);
	} catch (err) {
		return Promise.reject(new JwtVerificationError("Failed to verify token."));
	}

	return Promise.resolve(decodedToken)
}
