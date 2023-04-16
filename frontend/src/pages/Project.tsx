import { ReactElement } from "react";
import {parseJwt} from "../utils/jwt";


interface ProjectProps {}

function Project (props: ProjectProps): ReactElement {
	const token = localStorage.getItem('user');

	return <div>{ JSON.stringify(parseJwt(token as string)) }</div>
}

export default Project;
