import { ReactElement } from "react";
import { FaUserAlt } from 'react-icons/fa';

import { UNode } from "../../../types/Project";
import {cutString} from "../../../utils/string";

import styles from './styles.module.css';


export const userNodeAttributes = {
  'r': 45,
  'stroke-width': 2,
  'stroke': '#30363d',
  'fill': '#30363d'
};

function UserNodeElement (node: UNode): ReactElement {
  return (
    <div className={ styles.userNodeContainer }>
      <div className={ styles.userNodeIcon }>
        <FaUserAlt size={25} />
      </div>
      <div className={ styles.userNodeTitle }>
        <h5>{ cutString(node.username, 10) }</h5>
      </div>
    </div>
  );
}

export default UserNodeElement;
