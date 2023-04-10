import { ReactElement, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { ME } from '../graphql/Dashboard/me';
import { Project, User } from './definitions/Dashboard';
import { cutString, capitalize } from '../utils/string';
import { notify } from '../utils/notify';

import styles from '../style/dashboard.module.css';


interface DashboardProps {
}

function Dashboard (props: DashboardProps): ReactElement {
	const [me, setMe] = useState<User>({} as User)
	const [projects, setProjects] = useState<Project []>([]);

	const navigate = useNavigate();

	const { loading, error, data } = useQuery(ME);


	useEffect(() => {
		if (!data) {
			return;
		}

		const user = data.users[0];

		if (!user) {
			notify(error?.message as string, 'error');
			return;
		}

		let projects: Project [] = user.projects;

		projects = projects.map((project: Project) => ({
			name: cutString(project.name, 30),
			description: cutString(project.description, 100),
			role: capitalize(project.role)
		}));
		setProjects(projects);
		setMe(user as User);
	}, [error, data])


	const renderProjects = (project: Project): ReactElement => {
		const role: string = project.role.toLowerCase();

		return (
			<div id={ styles.projectItem }>
				<div id={ styles.projectItemContent }>
					<div className={ styles.itemHeader}>
						<a href="#">{ project.name }</a>
						<span id={styles[`${role}_label`]}>{ project.role }</span>
					</div>
					<span>{ project.description }</span>
				</div>
			</div>
		);
	}


	const handleLogOut = () => {
		localStorage.clear();
		navigate('/login');
	}


	return (
		<>
			<ClipLoader loading={loading} />
			<section id={ styles.dashboard }>
				<div id={ styles.header }>
					<div id={ styles.headerText }>
						<h1>Welcome back, { me.firstname}!</h1>
						{(projects.length === 0) && (
							<h5>Welcome { me.username }! Let's create a new project! ✨</h5>
						)}
						{(projects.length > 0 && projects.length <= 4) && (
							<h5>Well done you now participate to { projects.length } projects! Don't hesitate to invite people. You are not gona do the job alone! 😛</h5>
						)}
						{(projects.length > 4 && projects.length <= 15) && (
							<h5>You participate to { projects.length } projects! You are a real war machine!! 💪🔥</h5>
						)}
						{(projects.length > 15) && (
							<h5>{ projects.length } projects 😯! Don't forget to rest, you work harder than Elon... 🚀🌙</h5>
						)}
					</div>
					<div id={ styles.headerButtons }>
						<button id={ styles.settingsButton }>
							Settings
						</button>
						<button id={ styles.logoutButton } onClick={handleLogOut}>
							Log out
						</button>
					</div>
				</div>
				<div id={ styles.projectListArea }>
					<div id={ styles.projectList }>
						{projects.map(renderProjects)}
					</div>
				</div>
			</section>
		</>
	);
}

export default Dashboard;
