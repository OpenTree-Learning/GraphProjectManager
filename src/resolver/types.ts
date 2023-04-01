export interface MutationResponse {
	status: string,
	data: any
}

export type NodeLabels = "User" | "Project" | "Task";
export type EdgeTypes = "CONTRIBUTES" | "DEPENDS_ON";

export type Label = `:${NodeLabels | EdgeTypes}`;


export type Parameter = `${string}_${number}`;
export type ParameterObject = Record<Parameter, any>;

export type InputFilter = Record<string, any>;
export type Filter = `${string}: $${Parameter}`;
