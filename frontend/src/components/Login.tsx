import {ReactElement} from 'react';


interface LoginProps {
	onLoginSuccess: () => void
}

function Login (props: LoginProps): ReactElement {
	return (
		<div>Login</div>
	);
}

export default Login;
