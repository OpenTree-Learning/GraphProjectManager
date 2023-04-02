import React, {useEffect, useState} from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';

import './App.css';


function App() {

	const navigate = useNavigate();
	const [user, setUser] = useState(null)


	const handleUserLogin = () => {
		console.log('Do something when user is authenticated.');
	}


	return (
		<Routes>
			<Route index element={<Navigate to="/login"/>}/>
			<Route
				path="/login" 
				element={<Login onLoginSuccess={handleUserLogin}/>} 
			/>
			<Route
				path="/dashboard"
				element={user ? (
					<Dashboard/>
				) : (
					<Navigate to="/login"/>
				)}
			/>
		</Routes>
	);
}

export default App;
