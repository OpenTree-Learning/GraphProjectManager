export interface MutationResponse {
	status: string,
	data: any
}

export enum NodeTypes {
	USER = 'User',
	PROJECT = 'Project',
	TASK = 'Task'
}

export enum EdgeTypes {
	CONTRIBUTES = 'CONTRIBUTES',
	DEPENDS_ON = 'DEPENDS_ON'
}

export interface JwtPayload {
    [key: string]: any;
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
    jti?: string | undefined;
}
