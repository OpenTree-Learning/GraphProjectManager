import { ReactElement } from "react";
import { TNode } from "../../../types/Project";
import {cutString} from "../../../utils/string";

import styles from './styles.module.css';

export const taskNodeAttributes = {
  'r': 45,
  'stroke-width': 2,
  'stroke': '#1B4055',
  'fill': '#0f232f'
};

function TaskNodeElement (node: TNode): ReactElement {
  return (
    <div className={ styles.taskNodeContainer }>
      <div className={ styles.taskNodeTitle }>
        <h6>{ cutString(node.name, 15) }</h6>
      </div>
      <div className={ styles.taskNodeState }>
        <span className={`taskState taskState_${node.state}`}>{ node.state }</span>
      </div>
    </div>
  );
}

export default TaskNodeElement;
