import {JwtPayload} from "jsonwebtoken";

export interface MutationResponse {
	status: string,
	data: any
}

export interface ProjectAuthJwt extends JwtPayload {
	roles: string [],
	project_id: string
}
