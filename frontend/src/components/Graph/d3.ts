// @ts-nocheck

import React, {ReactElement} from 'react';
import * as d3 from 'd3';
import * as ReactDOMServer from 'react-dom/server';

import {CreateGraphParams, SVGDataEventListeners, SVGEventListeners, TargetElementTagName} from './types';
import {getInsribedRectInCircle, isRectangleContained, translatePoint} from './utils';


function processElementData<T, D>(
  element: T,
  data: D | ((nodeSVG: T) => D)
): D {
  if (typeof data === 'function') {
    return data(element);
  }
  return data;
}


function renderNodeComponentToHTML<T>(
  node: T,
  renderNode: ReactElement | ((nodeSVG: T) => ReactElement)
) {
  const nodeComponent = processElementData<T, ReactElement>(node, renderNode);
  const htmlString = ReactDOMServer.renderToString(nodeComponent);
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlString, 'text/html');

  return document.body.firstChild;
}


function getMatchingSVGElement<T> (
  element: any, 
  node: T,
  nodeIdProperty: string
) {
  const id = node[nodeIdProperty];
  const nodeElement = element.filter(md => md[nodeIdProperty] === id);

  return nodeElement;
}


function getNodeInnerElementSize<T> (
  element, 
  node: any,
  nodeIdProperty: string
) {
  const nodeElement = getMatchingSVGElement<T>(element, node, nodeIdProperty).node();
  const radius = nodeElement.r.baseVal.value;

  return getInsribedRectInCircle(radius);
}


function setAttributes (
  element,
  attributes: any
) {
  if (!element || !attributes) {
    return;
  }

  for (const key in attributes) {
    const name = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    let value = attributes[key];
    const currentValue = element.attr(name);

    element.attr(name, (node: any) => {
      if (typeof value === 'function') {
        return value(node, currentValue);
      }
      return value;
    });
  }
}


function setEventListeners<T> (
  element,
  eventListeners: SVGDataEventListeners<T> | SVGEventListeners
) {
  if (!element || !eventListeners) {
    return;
  }

  for (const key of Object.keys(eventListeners)) {
    element.on(key, event => {
      const callback = eventListeners[key];
      const tagName = event.target.constructor.name;
      let target = event.target;

      if (tagName === 'SVGSVGElement') {
        return callback(event, tagName);
      }

      if (tagName.startsWith('HTML')) {
        while (target.constructor.name != 'SVGForeignObjectElement') {
          target = target.parentNode;
        }
      }

      callback(event, target.__data__, tagName);
    });
  }
}


function createGraph<T>({
  ref,
  width,
  height,
  nodes,
  edges,
  nodeIdProperty,
  restrictRadius,
  nodeAttributes,
  nodeInnerElement,
  edgeAttributes,
  edgeLabel,
  edgeLabelAttributes,
  arrowHeight,
  arrowWidth,
  arrowAttributes,
  nodeEventListeners,
  edgeEventListeners,
  edgeLabelEventListeners,
  viewBoxEventListeners
}: CreateGraphParams<T>) {

  const nodeInnerElementId = (node: T) => `node_inner_element_${node[nodeIdProperty]}`;
  let nodesCopy = nodes.map(d => Object.assign({}, d));
  let edgesCopy = edges.map(d => Object.assign({}, d));

  const svg = d3.select(ref.current)
    .append('svg')
    .attr('viewBox', [0, 0, width, height])

  const simulation = d3.forceSimulation(nodesCopy)
    .force('edgeSVG', d3.forceLink(edgesCopy).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const edgeSVG = svg.append('g')
    .selectAll('line')
    .data(edgesCopy)
    .join('line')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  const arrowSVG = svg.append('g')
    .selectAll('polygon')
    .data(edgesCopy.filter(edge => edge.direction !== undefined))
    .join('polygon')
    .attr('fill', 'white')

  const edgeLabelSVG = svg.append('g')
    .selectAll('text')
    .data(edgesCopy)
    .join('text');

  if (edgeLabel) {
    edgeLabelSVG.text(edgeLabel);
  }

  const nodeSVG = svg.append('g')
    .selectAll('circle')
    .data(nodesCopy)
    .join('circle')
    .attr('r', 20)
    .attr('stroke-width', 5)
    .attr('stroke', 'white')
    .call(drag(simulation));

  const defaultArrowHeight = 20;
  const defaultArrowWidth = 20;

  arrowHeight = !arrowHeight ? defaultArrowHeight : arrowHeight;
  arrowWidth = !arrowWidth ? defaultArrowWidth : arrowWidth;

  setAttributes(edgeSVG, edgeAttributes);
  setAttributes(arrowSVG, arrowAttributes);
  setAttributes(edgeLabelSVG, edgeLabelAttributes);
  setAttributes(nodeSVG, nodeAttributes);

  const nodeInnerElementSVG = svg.append('g')
    .selectAll('foreignObject')
    .data(nodesCopy)
    .join('foreignObject')
    .attr('width', d => getNodeInnerElementSize<T>(nodeSVG, d, nodeIdProperty))
    .attr('height', d => getNodeInnerElementSize<T>(nodeSVG, d, nodeIdProperty))
    .call(drag(simulation));

  if (nodeInnerElement) {
    nodeInnerElementSVG
      .html(d => {
        const element = renderNodeComponentToHTML<T>(d, nodeInnerElement);

        element.setAttribute('id', nodeInnerElementId(d));
        return element.outerHTML;
      });

    nodeSVG.attr('r', d => {
      const circle = getMatchingSVGElement(nodeSVG, d, nodeIdProperty).node();

      if (restrictRadius === true) {
        return circle.r.baseVal.value;
      }

      const foreignObject = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty).node();
      const innerElement = foreignObject.firstChild;

      const foreignObjectRect = foreignObject.getBoundingClientRect();
      const innerElementRect = innerElement.getBoundingClientRect();

      if (!isRectangleContained(innerElementRect, foreignObjectRect)) {
        const margin = 14;
        const largestSize = Math.max(innerElementRect.height, innerElementRect.width) + margin;

        nodeInnerElementSVG.filter(d2 => d2.id === d.id)
          .attr('width', largestSize)
          .attr('height', largestSize);
        return Math.sqrt(2 * Math.pow(largestSize, 2)) / 2;
      }

      return circle.r.baseVal.value;
    });
  }

  setEventListeners(nodeSVG, nodeEventListeners);
  setEventListeners(nodeInnerElementSVG, nodeEventListeners);
  setEventListeners(edgeSVG, edgeEventListeners);
  setEventListeners(edgeLabelSVG, edgeLabelEventListeners);
  setEventListeners(svg, viewBoxEventListeners);


  simulation.on('tick', () => {
    edgeSVG
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    edgeLabelSVG
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2)

    arrowSVG
      .attr('points', d => {
        const source = getMatchingSVGElement<T>(nodeSVG, d.source, nodeIdProperty);
        const target = getMatchingSVGElement<T>(nodeSVG, d.target, nodeIdProperty);
        const direction = d.direction;
        const radius = direction ? target.attr('r') : source.attr('r');

        const x1 = d.source.x, y1 = d.source.y;
        const x2 = d.target.x, y2 = d.target.y;

        const dx = direction ? (x1 - x2) : (x2 - x1);
        const dy = direction ? (y1 - y2) : (y2 - y1);
        const origin = direction ? {x: x2, y: y2} : {x: x1, y: y1};

        const vertex = translatePoint(origin, {x: dx, y: dy}, radius); 
        const footAltitude = translatePoint(vertex, {x: dx, y: dy}, arrowHeight);

        const vectorAngle = Math.atan(dy / dx);
        const leftVertex = translatePoint(footAltitude, vectorAngle + Math.PI / 2, arrowWidth / 2);
        const rightVertex = translatePoint(footAltitude, vectorAngle - Math.PI / 2, arrowWidth / 2);

        return `${vertex.x},${vertex.y} ${leftVertex.x},${leftVertex.y} ${rightVertex.x},${rightVertex.y}`
      });

    nodeSVG
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    nodeInnerElementSVG
      .attr('x', d => {
        const nodeBBox = getMatchingSVGElement<T>(nodeSVG, d, nodeIdProperty)
          .node()
          .getBBox();
        const innerNodeElementBBox = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty)
          .node()
          .getBBox();

        return nodeBBox.x + (nodeBBox.width / 2) - (innerNodeElementBBox.width / 2);
      })
      .attr('y', d => {
        const nodeBBox = getMatchingSVGElement<T>(nodeSVG, d, nodeIdProperty)
          .node()
          .getBBox();
        const innerNodeElementBBox = getMatchingSVGElement<T>(nodeInnerElementSVG, d, nodeIdProperty)
          .node()
          .getBBox();

        return nodeBBox.y + (nodeBBox.height / 2) - (innerNodeElementBBox.height / 2);
      });
  });


  function drag (simulation) {
    function dragstarted (e, d) {
      if (!e.active) {
        simulation.alphaTarget(0.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged (e, d) {
      d.fx = e.x;
      d.fy = e.y;
    }

    function dragended (e, d) {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
}


export default createGraph;
