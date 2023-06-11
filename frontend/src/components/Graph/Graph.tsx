import React from 'react';
import { useRef, useEffect, ReactElement } from 'react';

import createGraph from './d3';
import {GraphProps} from './types';

import './Graph.css';


function Graph<T>(props: GraphProps<T>): ReactElement {
  const graphContainerRef = useRef(null);

  useEffect(() => {
    console.log('loading the graph for the first time.');
    // @ts-ignore
    createGraph<T>({
      ref: graphContainerRef,
      ...props
    })
  }, [props.nodes, props.edges]);

  useEffect(() => {
    console.log('performing new graph render.');
  }, [props.nodes]);
  

  return (
    <div ref={graphContainerRef}></div>
  );
}

export default Graph;
