import React, {ReactElement, useEffect, useState} from 'react';
import rd3 from 'react-d3-library';

import createGraph from './graph';


const RD3Component = rd3.Component;

interface GraphProps {
	nodes: any [],
	links: any [],
	width: number,
	height: number,
	nodeTitle: (n: any) => string,
	nodeGroups: string [],
	nodeGroup: (n: any) => string,
	nodeFill: number,
	nodeStroke: number,
	linkStroke: number
}

function Graph ({
	nodes,
	links,
	width,
	height,
	nodeTitle,
	nodeGroups,
	nodeGroup,
	nodeFill,
	nodeStroke,
	linkStroke
}: GraphProps): ReactElement {
	const [data, setData] = useState<any>({});

	useEffect(() => {
		const node = createGraph({ nodes, links}, {width, height, nodeTitle, nodeGroups, nodeGroup, nodeFill, nodeStroke, linkStroke});

		setData(node);
	}, []);

	return (
		<div>
			<RD3Component data={data} />
		</div>
	);
}
