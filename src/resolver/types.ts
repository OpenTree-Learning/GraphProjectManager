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
