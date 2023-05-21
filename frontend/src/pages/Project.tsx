import { ReactElement, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import Graph from '../components/Graph';
import NodeElement, { nodeAttributes, edgeAttributes, arrowAttributes } from "../components/Nodes";

import { PROJECT_GRAPH } from "../graphql/Project/projectGraph";
import { notify } from "../utils/notify";
import { TPriorityOrder, TState, PNode, TNode, UNode, ProjectNode } from "../types/Project";
import { Edge } from "../components/Graph/types";

import '../style/project.css';


interface ProjectProps {}


function Project (props: ProjectProps): ReactElement {
  const ProjectGraph = Graph<ProjectNode>;
	const projectGraph = useQuery(PROJECT_GRAPH);

  const [nodes, setNodes] = useState<ProjectNode []>([]);
  const [edges, setEdges] = useState<Edge []>([]);

	useEffect(() => {
		const {loading, error, data} = projectGraph;

		if (!data || !data.projectGraph) {
			notify(error?.message as string, 'error');
			return;
		}

    setNodes(data.projectGraph.nodes);
    setEdges(data.projectGraph.edges.map((d: any) => ({...d, direction: true})));

	}, [projectGraph]);

  return (
    <>
      {nodes.length && edges.length && (
        <ProjectGraph
          width={window.innerWidth}
          height={window.innerHeight}
          nodes={nodes}
          edges={edges}
          nodeIdProperty="id"
          restrictRadius={true}
          nodeAttributes={nodeAttributes}
          edgeAttributes={edgeAttributes}
          arrowAttributes={arrowAttributes}
          nodeInnerElement={(node: ProjectNode) => NodeElement(node)}
        />
      )}
    </>
  );
};

export default Project;
