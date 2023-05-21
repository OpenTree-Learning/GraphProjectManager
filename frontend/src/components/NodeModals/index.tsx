import { ReactElement } from "react";
import { ProjectNode, TNode } from "../../types/Project";
import EditTask from "./EditTask";


interface NodeModalProps {
  node: ProjectNode
}

function NodeModal (props: NodeModalProps): ReactElement {
  const { node } = props;

  if (node.__typename === 'TNode') {
    return <EditTask task={node as TNode}/>
  }
  return <></>;
}

export default NodeModal;
