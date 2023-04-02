import {ReactElement, useState} from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from '../style/login.module.css';


interface LoginProps {
	onLoginSuccess: () => void
}

function Login (props: LoginProps): ReactElement {
	const [login, setLogin] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginError, setLoginError] = useState<string>('');

	const [loading, setLoading] = useState(false);

	const handleSubmit = () => {
	};

	return (
		<div className={styles.container}>
			<img src='./logo.png' alt='GPM logo'/>
			{loginError && (
				<div className={styles.loginError}>
					<span>{loginError}</span>
				</div>
			)}
			<ClipLoader loading={loading} />
			<div className={styles.loginForm}>
				<input type='text' id='login' name='login' onChange={e => setLogin(e.target.value)} value={login} placeholder='Email'/>
				<input type='password' id='password' name='password' onChange={e => setPassword(e.target.value)} value={password} placeholder='Password'/>
				<input type='button' onClick={handleSubmit} value='Connect'/>
			</div>
		</div>
	);
}

export default Login;
