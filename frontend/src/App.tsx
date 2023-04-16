import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import {parseJwt} from './utils/jwt';


function App() {
	const navigate = useNavigate();

	const handleUserLogin = () => {
		navigate('/dashboard');
	}

	const encodedToken = localStorage.getItem('user');
	const token = encodedToken ? parseJwt(encodedToken) : {};

	function redirectProject () {
		if (token.sub && token.roles && token.project_id) {
			return <Project/>
		}
		if (token.sub) {
			return <Navigate to="/dashboard"/>
		}
		return <Navigate to="/login"/>
	}

	return (
		<>
			<Routes>
				<Route index element={<Navigate to="/dashboard"/>}/>
				<Route
					path="/login" 
					element={<Login onLoginSuccess={handleUserLogin}/>} 
				/>
				<Route
					path="/register" 
					element={<Register />}
				/>
				<Route
					path="/dashboard"
					element={token.sub ? (
						<Dashboard/>
					) : (
						<Navigate to="/login"/>
					)}
				/>
				<Route
					path="/project/:uuid"
					element={redirectProject()}
				/>
			</Routes>
			<ToastContainer/>
		</>
	);
}

export default App;
