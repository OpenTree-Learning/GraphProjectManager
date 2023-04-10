import { ReactElement, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { FaTasks } from 'react-icons/fa';

import { USER } from '../graphql/Dashboard/user';
import { RECENT_ACTIVITIES } from '../graphql/Dashboard/recentActivities';
import { Project, User, Activity } from './definitions/Dashboard';
import { cutString, capitalize } from '../utils/string';
import { parseJwt } from '../utils/jwt';
import { notify } from '../utils/notify';
import ProjectTile from '../components/ProjectTile';

import styles from '../style/dashboard.module.css';
import RecentActivity from '../components/RecentActivity';


interface DashboardProps {}

function Dashboard (props: DashboardProps): ReactElement {
	const [me, setMe] = useState<User>({} as User)
	const [projects, setProjects] = useState<Project []>([] as Project []);
	const [recentActivities, setRecentActivities] = useState<Activity []>([] as Activity []);

	const navigate = useNavigate();

	const token = parseJwt(localStorage.getItem('user') as string);
	const meQuery = useQuery(USER, {
		variables: {id: token.sub}
	});
	const recentActivitiesQuery = useQuery(RECENT_ACTIVITIES);

	useEffect(() => {
		const {loading, error, data} = meQuery;

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
	}, [meQuery]);


	useEffect(() => {
		const {loading, error, data} = recentActivitiesQuery;
		
		if (!data) {
			return;
		}

		let recentActivities = data.recentActivity.data;

		setRecentActivities(recentActivities)
	}, [recentActivitiesQuery]);


	const handleLogOut = () => {
		localStorage.clear();
		navigate('/login');
	}


	return (
		<>
			{/*<ClipLoader loading={loading} />*/}
			<section id={ styles.dashboard }>
				<header id={ styles.header }>
					<div id={ styles.headerArea } >
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
				</header>
				<main id={ styles.main }>
					<div id={ styles.mainArea }>
						<div id={ styles.recentActivityArea }>
							<div className={ styles.sectionHeader }>
								<h3>Recent activity</h3>
							</div>
							<RecentActivity activities={recentActivities}/>
						</div>
						<div id={ styles.projectListArea }>
							<div className={ styles.sectionHeader }>
								<h3>Your projects</h3>
								<button id={ styles.newProjectButton }>
									<FaTasks/>
									<span>New</span>
								</button>
							</div>
							<div id={ styles.projectList }>
								{projects.map((project, idx) =>
									<ProjectTile key={idx} project={project}/>
								)}
							</div>
						</div>
					</div>
				</main>
			</section>
		</>
	);
}

export default Dashboard;
