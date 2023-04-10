import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


function App() {
	const navigate = useNavigate();

	const handleUserLogin = () => {
		navigate('/dashboard');
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
					path="/dashboard"
					element={localStorage.getItem('user') ? (
						<Dashboard/>
					) : (
						<Navigate to="/login"/>
					)}
				/>
			</Routes>
			<ToastContainer/>
		</>
	);
}

export default App;
