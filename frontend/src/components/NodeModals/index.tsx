import { ReactElement } from "react";
import { ProjectNode, TNode } from "../../types/Project";
import EditTask from "./EditTask";


export interface NodeModalProps {
  node: ProjectNode,
  onTitleSet: (title: string) => void,
  onMainButtonSet: (title: string, color: string, callback: (e: Event) => void) => void,
  onSecondButtonSet: (title: string, color: string, callback: (e: Event) => void) => void,
  closeModal: () => void
}

function NodeModal (props: NodeModalProps): ReactElement {
  const { node } = props;

  if (node.__typename === 'TNode') {
    return <EditTask
      node={node} 
      onTitleSet={props.onTitleSet}
      onMainButtonSet={props.onMainButtonSet}
      onSecondButtonSet={props.onSecondButtonSet}
      closeModal={props.closeModal}
    />;
  }
  return <></>;
}

export default NodeModal;
