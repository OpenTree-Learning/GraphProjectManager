// @ts-nocheck

import { ReactElement } from 'react';

import { ProjectNode, PNode, TNode, UNode } from '../../types/Project';
import { Edge } from '../Graph/types';

import ProjectNodeElement, { projectNodeAttributes } from './Project';
import TaskNodeElement, { taskNodeAttributes } from './Task';
import UserNodeElement, { userNodeAttributes } from './User';


const mergedNodeAttributes = {
  'PNode': projectNodeAttributes,
  'TNode': taskNodeAttributes,
  'UNode': userNodeAttributes
};

const computeNodeAttributes = (attributeName: string, node: ProjectNode, defaultValue: any) => {
  const nodeType: string = node.__typename as string;

  if (!(nodeType in mergedNodeAttributes) || !(attributeName in mergedNodeAttributes[nodeType])) {
    return defaultValue;
  }
  return mergedNodeAttributes[nodeType][attributeName];
}

export const nodeAttributes = {
  'r': (node: ProjectNode, defaultValue: any) => computeNodeAttributes('r', node, defaultValue),
  'stroke': (node: ProjectNode, defaultValue: any) => computeNodeAttributes('stroke', node, defaultValue),
  'stroke-width': (node: ProjectNode, defaultValue: any) => computeNodeAttributes('stroke-width', node, defaultValue),
  'fill': (node: ProjectNode, defaultValue: any) => computeNodeAttributes('fill', node, defaultValue) 
};

export const edgeAttributes = {
  'stroke': (edge: Edge, defaultValue: any) => edge.target.__typename === 'UNode' ? '#dd4b39' : '#abfffe'
};

export const arrowAttributes = {
  'stroke': '0',
  'fill': (edge: Edge, defaultValue: any) => edge.target.__typename === 'UNode' ? '#dd4b39' : '#abfffe'
};


const allNodeElements = {
  'PNode': (node: ProjectNode) => ProjectNodeElement(node as PNode),
  'TNode': (node: ProjectNode) => TaskNodeElement(node as TNode),
  'UNode': (node: ProjectNode) => UserNodeElement(node as UNode)
};

function NodeElement (node: ProjectNode): ReactElement {
  // @ts-ignore
  return allNodeElements[node.__typename](node);
}

export default NodeElement;
