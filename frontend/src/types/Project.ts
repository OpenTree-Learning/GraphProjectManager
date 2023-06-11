interface Node {
  __typename: string
  id: string
  createdAt: string
}

export enum TPriorityOrder {
  LOW,
  NORMAL,
  HIGH,
  URGENT
}

export enum TState {
  TODO,
  DOING,
  DONE
}

export interface PNode extends Node {
  name: string
  description: string
}

export interface TNode extends Node {
  name: string
  description: string
  updatedAt: string
  updatedBy: string
  labels: string [],
  priorityOrder: string,
  state: string
  oldState: string
}

export interface UNode extends Node {
  username: string
  firstname: string
  lastname: string
  email: string
  updatedAt: string
}

export type ProjectNode = PNode | TNode | UNode
