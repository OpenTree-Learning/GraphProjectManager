import d3, {Simulation} from 'd3';


function createGraph (
	{ nodes, links } : { nodes: any [], links: any [] },
	{
		width, 
		height,
		nodeTitle,
		nodeGroups,
		nodeGroup,
		nodeFill,
		nodeStroke,
		linkStroke
	} : {
		width: number,
		height: number,
		nodeTitle: (n: any) => string,
		nodeGroups: string [],
		nodeGroup: (n: any) => string,
		nodeFill: number,
		nodeStroke: number,
		linkStroke: number,
	}
) {
	const forceNode = d3.forceManyBody();
	const forceLink = d3.forceLink(links).id((node, i) => nodes[i]);

	const simulation = d3.forceSimulation(nodes)
		.force('link', forceLink)
		.force('charge', forceNode)
		.force('center', d3.forceCenter())
		.on('tick', ticked);
	
	const svg = d3.create('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [innerHeight, innerWidth]);
	
	const link = svg.append('g')
		.attr('stroke', linkStroke)
		.attr('stroke-opacity', 1)
		.attr('stroke-linecap', 'round')
		.selectAll('line')
		.data(links)
		.attr('r', 5)
		// @ts-ignore
		.call(drag(simulation))
	
	const node = svg.append('g')
		.attr('fill', nodeFill)
		.attr('stroke', nodeStroke)
		.attr('stroke-opacity', 1)
		.attr('stroke-width', 2)
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('r', 5)
		// @ts-ignore
		.call(drag(simulation));
	
	function ticked() {
		link
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);

		node
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);
	}
	
	const drag = (simulation: any) => {
		function dragstarted(event: any) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event: any) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event: any) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		return d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	}

	//const colors = d3.schemeTableau10;
	//const color = d3.scaleOrdinal()
	//		.domain(nodeGroups)
	//		.range(colors);

	return svg.node();
}

export default createGraph;
