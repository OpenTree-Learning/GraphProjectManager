import { ReactElement, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { notify } from '../utils/notify';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from '../style/login.module.css';
import { AUTH } from '../graphql/Login/auth';
import { Project } from './definitions/Dashboard';


interface LoginProps {
	onLoginSuccess: () => void
}

function Login (props: LoginProps): ReactElement {
	const [login, setLogin] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loginError, setLoginError] = useState<string>('');

	const navigate = useNavigate();

	const [auth, { data, loading, error }] = useMutation(AUTH);


	const handleSubmit = () => {
		auth({ variables: { 
			email: login,
			password: password
		}})
		.then(res => {
			const { data } = res;
			const status = data.auth.status;
			const token = data.auth.data;
			
			if (token !== null) {
				localStorage.setItem('user', token);
				notify(status, 'success');
				props.onLoginSuccess();
			} else {
				notify(status, 'error');
			}
		})
		.catch(err => {
			notify(err.message, 'error');
		})
	};

	const handleNoAccountClick = (project: Project): void => {
	}

	return (
		<div className={styles.container}>
			<img src='./logo.png' alt='GPM logo'/>
			<ClipLoader loading={loading} />
			<div className={styles.loginForm}>
				<input type='text' id='login' name='login' onChange={e => setLogin(e.target.value)} value={login} placeholder='Email'/>
				<input type='password' id='password' name='password' onChange={e => setPassword(e.target.value)} value={password} placeholder='Password'/>
				<input type='button' onClick={handleSubmit} value='Connect'/>
				<Link id={ styles.noAccountLink } to='../register'>I have no account</Link>
			</div>
		</div>
	);
}

export default Login;
