import { ReactElement, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Graph } from 'react-d3-graph';

import { PROJECT_GRAPH } from "../graphql/Project/projectGraph";
import { notify } from "../utils/notify";
import { TPriorityOrder, TState, PNode, TNode, UNode, ProjectNode } from "./definitions/Project";
import styles from '../style/project.module.css';


interface ProjectProps {}

function Project (props: ProjectProps): ReactElement {
	const [graph, setGraph] = useState({nodes: [], links: []});
	const projectGraphQuery = useQuery(PROJECT_GRAPH);

	const renderNodeProjectLabel = (node: ProjectNode) => {
		if (node.__typename === 'PNode' || node.__typename === 'TNode')  {
			return (node as TNode).name;
		}
		if (node.__typename === 'UNode') {
			return (node as UNode).username;
		}
		return '';
	}

	const renderNodeProject = (node: ProjectNode) => {
		const nodeClassName = node.__typename === 'TNode' ? `TNode_${(node as TNode).state}` : node.__typename;		

		console.log({
			node: node,
			className: `${styles[nodeClassName]} ${styles.node}`
		});
		return <div className={`${styles[nodeClassName]} ${styles.node}`}/>
	}

	const config = {
		automaticRearrangeAfterDropNode: true,
		collapsible: true,
		directed: true,
		height: window.innerHeight,
		width: window.innerWidth,
		maxZoom: 8,
		minZoom: 0.1,
		node: {
			fontColor: '#d3d3d3',
			labelProperty: renderNodeProjectLabel,
			viewGenerator: renderNodeProject
		},
		d3: {
			alphaTarget: 0.05,
			gravity: -100,
			linkLength: 50,
			linkStrength: 1,
			disableLinkForce: false

		},
		link: {
			type: 'CURVE_SMOOTH'
		}
	};

	useEffect(() => {
		const {loading, error, data} = projectGraphQuery;

		if (!data) {
			return;
		}

		const { projectGraph } = data;

		if (!projectGraph) {
			notify(error?.message as string, 'error');
			return;
		}

		setGraph({
			nodes: projectGraph.nodes,
			links: projectGraph.edges
		});
	})

	return (
		<div>
			{graph.nodes.length > 0 && (
				<Graph
					id='graph'
					data={graph}
					config={config}
				/>
			)}
		</div>
	);
};

export default Project;
