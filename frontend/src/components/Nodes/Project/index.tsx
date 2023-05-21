import { ReactElement } from "react";
import { FaHome } from 'react-icons/fa';

import { PNode } from "../../../types/Project";
import { cutString } from "../../../utils/string";

import styles from './styles.module.css';


export const projectNodeAttributes = {
  'r': 80,
  'stroke-width': 5,
  'stroke': '#1B4055',
  'fill': '#202032'
};

function ProjectNodeElement (node: PNode): ReactElement {
  return (
    <div className={ styles.projectNodeContainer }>
      <div className={ styles.projectIcon }>
        <FaHome size={25}/>
      </div>
      <div className={  styles.projectNodeTitle }>
        <h4>{ cutString(node.name, 15) }</h4>
      </div>
      <div className={ styles.projectNodeDescription }>
        <p>{ cutString(node.description, 35) }</p>
      </div>
    </div>
  );
}

export default ProjectNodeElement;
