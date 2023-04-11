import { ReactElement, useEffect, useState } from 'react';
import styles from '../style/dashboard.module.css';
import { Project } from '../pages/definitions/Dashboard';


interface ProjectTileProps {
	project: Project,
	onProjectSelect: (project: Project) => void
}

function ProjectTile (props: ProjectTileProps): ReactElement {
	const { project } = props;
	const role = project.role.toLowerCase();

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

export default ProjectTile;
