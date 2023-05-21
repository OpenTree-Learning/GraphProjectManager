import { ReactElement, useEffect, useState } from 'react';
import styles from '../style/dashboard.module.css';
import { Project } from '../types/Dashboard';


interface ProjectTileProps {
	project: Project,
	onProjectSelect: (project: Project) => void
}

function ProjectTile ({ project, onProjectSelect }: ProjectTileProps): ReactElement {
	const role = project.role.toLowerCase();

	return (
		<div id={ styles.projectItem } onClick={ () => onProjectSelect(project) }>
			<div id={ styles.projectItemContent }>
				<div className={ styles.itemHeader}>
					<a className={ styles.projectLink } >{ project.name  }</a>
					<span id={styles[`${role}_label`]}>{ project.role }</span>
				</div>
				<span>{ project.description }</span>
			</div>
		</div>
	);
}

export default ProjectTile;
