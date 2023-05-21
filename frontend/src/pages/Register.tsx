import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { notify } from '../utils/notify';
import ClipLoader from 'react-spinners/ClipLoader';
import styles from '../style/register.module.css';
import { CREATE_USER } from '../graphql/Register/createUser';


interface RegisterProps {}

function Register (props: RegisterProps): ReactElement {
	const [email, setEmail] = useState<string>('');
	const [emailValid, setEmailValid] = useState<boolean | null>(null);
	const [username, setUsername] = useState<string>('');
	const [firstname, setFirstname] = useState<string>('');
	const [lastname, setLastname] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [samePassword, setSamePassword] = useState<boolean | null>(null);

	const navigate = useNavigate();

	const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

	useEffect(() => {
		if (email.length > 0) {
			setEmailValid(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
		}
	}, [email]);

	useEffect(() => {
		if (password.length > 0) {
			setPasswordValid(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password));
		}
	}, [password]);

	useEffect(() => {
		setSamePassword(password === passwordConfirm);
	}, [passwordConfirm])

	const handleBack = () => {
		navigate('..');
	}

	const handleSubmit = () => {
		if (!emailValid || !passwordValid || !passwordConfirm) {
			notify('Please fill the form.', 'error');
			return;
		}

		createUser({variables: {
			username, email, password, firstname, lastname
		}}).then(res => {
			const { data } = res;
			const status = data.createUser.status;
			const user = data.createUser.data;
			
			if (user !== null) {
				notify(status, 'success');
				navigate('..')
			} else {
				notify(status, 'error');
			}
		})
	}

	return (
		<div id={ styles.container }>
			<div id={ styles.bg }>
				<img src='./logo.png' alt='GPM logo' id={ styles.logo }/>
				<h1>Join millions of users managing their project with us.</h1>
			</div>
			<ClipLoader loading={loading} />
			<div id={ styles.registerForm }>
				<h3>Join us!</h3>
				<input 
					type='text' id='email' name='email' 
					onChange={e => setEmail(e.target.value)} value={email} placeholder='Email'
					className={ emailValid ? '' : 'invalidInput' }
				/>
				{emailValid === false && (<span>Invalid email.</span>)}
				<input 
					type='text' id='username' name='username' 
					onChange={e => setUsername(e.target.value)} value={username} placeholder='Username'
				/>
				<h3>Who are you?</h3>
				<input 
					type='text' id='firstname' name='firstname' 
					onChange={e => setFirstname(e.target.value)} value={firstname} placeholder='Firstname'
				/>
				<input 
					type='text' id='lastname' name='lastname' 
					onChange={e => setLastname(e.target.value)} value={lastname} placeholder='Lastname'
				/>
				<h3>Secure your account</h3>
				<input 
					type='password' id='password' name='password' 
					onChange={e => setPassword(e.target.value)} value={password} placeholder='Password'
					className={ passwordValid && samePassword ? '' : 'invalidInput' }
				/>
				{passwordValid === false && (<span>Invalid password format.</span>)}
				<input 
					type='password' id='passwordConfirm' name='passwordConfirm' 
					onChange={e => setPasswordConfirm(e.target.value)} value={passwordConfirm} placeholder='Confirm password'
					className={ samePassword ? '' : 'invalidInput' }
				/>
				{samePassword === false && (<span>Passwords must be the sames.</span>)}
				<input type='button' onClick={handleBack} value='Back' id={ styles.backButton }/>
				<input 
					type='button' onClick={handleSubmit} value='Join' id={ styles.registerButton } 
					disabled={!emailValid || !passwordValid || !passwordConfirm}
				/>
			</div>
		</div>
	);
}

export default Register
