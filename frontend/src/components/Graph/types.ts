import {ReactElement, SVGAttributes} from "react";


export type Id = number | string;


type MappedSVGAttributes<D, T> = {
  [P in keyof T]: T[P] | ((node: D, defaultValue: T[P]) => T[P])
}

type OriginalSVGCircleStyleAttributes = Omit<SVGAttributes<SVGCircleElement>, 'cx' | 'cy'>;
type OriginalSVGLineStyleAttributes = Omit<SVGAttributes<SVGLineElement>, 'x1' | 'y1' | 'x2' | 'y2'>;
type OriginalSVGTextStyleAttributes = Omit<SVGAttributes<SVGTextElement>, 'x' | 'y'>;
type OriginalSVGPolygonStyleAttributes = Omit<SVGAttributes<SVGPolygonElement>, 'points'>;

export type SVGCircleStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGCircleStyleAttributes>;
export type SVGLineStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGLineStyleAttributes>;
export type SVGTextStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGTextStyleAttributes>;
export type SVGPolygonStyleAttributes<T> = MappedSVGAttributes<T, OriginalSVGPolygonStyleAttributes>;

export type TargetElementTagName = keyof SVGElementTagNameMap | keyof HTMLElementTagNameMap;
export type SVGElementEvent = keyof SVGElementEventMap;

export type SVGDataEventListeners<T> = Partial<{
  [K in SVGElementEvent]: (e: Event, data: T, tagName: TargetElementTagName) => void
}>;

export type SVGEventListeners = Partial<{
  [K in SVGElementEvent]: (e: Event, tagName: TargetElementTagName) => void
}>;

export interface Edge {
  id: Id,
  source: Id,
  target: Id,
  direction?: boolean
}

export interface GraphProps<T> {
  width: number,
  height: number,
  nodes: T [],
  edges: Edge [],
  nodeIdProperty: string,
  restrictRadius?: boolean,
  nodeAttributes?: SVGCircleStyleAttributes<T>,
  nodeInnerElement?: ReactElement | ((node: T) => ReactElement),
  edgeAttributes?: SVGLineStyleAttributes<Edge>,
  edgeLabel?: string | ((edge: Edge) => string),
  edgeLabelAttributes?: SVGTextStyleAttributes<Edge>,
  arrowHeight?: number,
  arrowWidth?: number,
  arrowAttributes?: SVGPolygonStyleAttributes<Edge>,
  nodeEventListeners?: SVGDataEventListeners<T>,
  edgeEventListeners?: SVGDataEventListeners<Edge>,
  edgeLabelEventListeners?: SVGDataEventListeners<Edge>,
  viewBoxEventListeners?: SVGEventListeners
}

export interface CreateGraphParams<T> extends GraphProps<T> {
  ref: React.RefObject<Element>
}
