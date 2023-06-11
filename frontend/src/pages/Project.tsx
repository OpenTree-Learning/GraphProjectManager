import { DOMElement, ReactElement, useEffect, useState } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
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

function setNodeHoverFilter (e: Event, filter: string, data: ProjectNode) {
  e.preventDefault();

  if (!data || !data.id) {
    return;
  }

  const node = document.getElementById(`node_${data.id}`);
  const nodeInnerElement = document.getElementById(`nodeInnerElement_${data.id}`);

  if (!node || !nodeInnerElement) {
    return;
  }
  // @ts-ignore
  node.style.filter = filter;
  // @ts-ignore
  nodeInnerElement.style.filter = filter;
}


function Project (props: ProjectProps): ReactElement {
  const ProjectGraph = Graph<ProjectNode>;
	const projectGraph = useQuery(PROJECT_GRAPH, {
    notifyOnNetworkStatusChange: true
  });

  const [nodes, setNodes] = useState<ProjectNode []>([]);
  const [edges, setEdges] = useState<Edge []>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<ProjectNode>({} as ProjectNode);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMainButton, setModalMainButton] = useState<any>({});
  const [modalSecondButton, setModalSecondButton] = useState<any>({});

	useEffect(() => {
		const { error, data, networkStatus } = projectGraph;

		if (!data || !data.projectGraph) {
			notify(error?.message as string, 'error');
			return;
		}

    console.log('changing project graph:', projectGraph);
    console.log('project graph query state:', networkStatus);

    const newNodes = JSON.parse(JSON.stringify(data.projectGraph.nodes));
    const newEdges = JSON.parse(JSON.stringify(data.projectGraph.edges))
      .map((d: any) => ({...d, direction: true}));

    setNodes(newNodes);
    setEdges(newEdges);

	}, [projectGraph]);

  useEffect(() => {
    console.log('changing edges:', edges)
    console.log('changing nodes:', nodes)
  }, [edges, nodes])

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
      borderColor: '#474a56',
      padding: '2px !important'
    },
  };


  return (
    <>
      <Modal 
        isOpen={modalOpen}
        style={modalCustomStyles}
      >
        <div className={ styles.modalContent }>
          <div className={ styles.modalHeader }>
            <div className={ styles.modalHeaderContent }>
              <div className={ styles.modalTitle }>
                <h2>{ modalTitle }</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className={ styles.modalCloseButton } >
                <MdClose size={20} color="#ffffff" />
              </button>
            </div>
          </div>
          <NodeModal 
            node={selectedNode}
            onTitleSet={(title: string) => setModalTitle(title)}
            onMainButtonSet={(title: string, color: string, callback: any) => setModalMainButton({title, color, callback})}
            onSecondButtonSet={(title: string, color: string, callback: any) => setModalSecondButton({title, color, callback})}
            closeModal={() => setModalOpen(false)}
          />
          { [...Object.keys(modalMainButton), ...Object.keys(modalSecondButton)].length && (
            <div className={ styles.modalFooter }>
              <div className={ styles.modalFooterContent }>
                <button
                  onClick={ modalMainButton.callback }
                  className={ styles.modalMainButton }
                  style={{ backgroundColor: modalMainButton.color }}
                >
                  { modalMainButton.title  }
                </button>
                <button 
                  onClick={ modalSecondButton.callback }
                  className={ styles.modalSecondButton }
                  style={{ backgroundColor: modalSecondButton.color }}
                >
                  { modalSecondButton.title }
                </button>
              </div>
            </div>
          )}
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
              console.log(data);
              setSelectedNode(data);
              setModalOpen(true);
            },
            'mouseover': (e: Event, data: ProjectNode, __: TargetElementTagName) => setNodeHoverFilter(e, 'brightness(120%)', data),
            'mouseout': (e: Event, data: ProjectNode, __: TargetElementTagName) => setNodeHoverFilter(e, 'initial', data)
          }}
        />
      )}
    </>
  );
};

export default Project;
