import { ReactElement, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Modal from 'react-modal';
import { MdClose } from 'react-icons/md';

import Graph from '../components/Graph';
import NodeElement, { nodeAttributes, edgeAttributes, arrowAttributes } from "../components/Nodes";

import { PROJECT_GRAPH } from "../graphql/Project/projectGraph";
import { notify } from "../utils/notify";
import { TPriorityOrder, TState, PNode, TNode, UNode, ProjectNode } from "../types/Project";
import { Edge, TargetElementTagName } from "../components/Graph/types";

import '../style/project.css';
import styles from '../style/project.module.css';
import NodeModal from "../components/NodeModals";


interface ProjectProps {}


function Project (props: ProjectProps): ReactElement {
  const ProjectGraph = Graph<ProjectNode>;
	const projectGraph = useQuery(PROJECT_GRAPH);

  const [nodes, setNodes] = useState<ProjectNode []>([]);
  const [edges, setEdges] = useState<Edge []>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<ProjectNode>({} as ProjectNode);

	useEffect(() => {
		const {loading, error, data} = projectGraph;

		if (!data || !data.projectGraph) {
			notify(error?.message as string, 'error');
			return;
		}

    setNodes(data.projectGraph.nodes);
    setEdges(data.projectGraph.edges.map((d: any) => ({...d, direction: true})));

	}, [projectGraph]);

  const modalCustomStyles = {
    overlay: {
      backgroundColor: 'rgb(255, 255, 255, 0.3)'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: 'auto',
      backgroundColor: '#30363d',
      borderColor: '#474a56'
    },
  };


  return (
    <>
      <Modal 
        isOpen={modalOpen}
        style={modalCustomStyles}
      >
        <div className={ styles.modalContent }>
          <button onClick={() => setModalOpen(false)} className={ styles.modalCloseButton } >
            <MdClose size={20} color="#ffffff" />
          </button>
          <NodeModal node={selectedNode}/>
        </div>
      </Modal>
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
          nodeEventListeners={{
            'click': (_: Event, data: ProjectNode, __: TargetElementTagName) => {
              setSelectedNode(data);
              setModalOpen(true);
            }
          }}
        />
      )}
    </>
  );
};

export default Project;
