<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { stages, dims, bound, layoffs } = $props();

	// Define accessors
	const xAccessor = (d) => d.stage; //shared with colorScale
	const yAccessor = (d) => d.layoff;
	const rAccessor = (d) => (d.percentage ? d.percentage : 20);

	// Define scales: color -> stage, radius -> percentage, y -> layoff, x -> stages
	const colorScale = d3
		.scaleOrdinal()
		.domain(stages)
		.range(['#CC5456', '#88CC54', '#8CD5E1', '#549ECC', '#6E94FC', '#C7C7C7']);

	const rScale = d3.scaleSqrt().domain([0, 100]).range([0, 14]);
	const xScale = d3.scaleBand().domain(stages).range([0, bound.width]).paddingOuter(0.5);
	const yScale = d3.scaleLinear().domain(d3.extent(layoffs, yAccessor)).range([bound.height, 0]);

	const nodes = layoffs.map((n, i) => ({
		...n,
		index: i,
		x: bound.width / 2 + dims.marginLeft,
		y: bound.height + dims.marginTop
	}));
	let nodeState = $state(nodes);

	$effect(() => {
		// Define the simulation & run tick
		const simulation = d3
			.forceSimulation(nodes)
			.force('charge', d3.forceManyBody().strength(-70))
			.force(
				'collide',
				d3.forceCollide().radius((d) => rScale(rAccessor(d)))
			)
			.force(
				'x',
				d3
					.forceX()
					.x((d) => xScale(xAccessor(d)))
					.strength(1)
			)
			.force(
				'y',
				d3
					.forceY()
					.y((d) => yScale(yAccessor(d)))
					.strength(1.1)
			)
			.alpha(0.1)
			.restart();

		simulation.on('tick', () => {
			nodeState = simulation.nodes();
		});
	});
</script>

<svg width={dims.width} height={dims.height} viewBox="0, 0, {dims.width}, {dims.height}">
	<g transform="translate({dims.marginLeft}, {dims.marginTop})">
		{#each nodeState as node}
			<circle
				cx={node.x}
				cy={node.y}
				r={rScale(rAccessor(node))}
				fill={colorScale(xAccessor(node))}
				stroke={node.percentage ? 'none' : '#fff'}
				opacity={node.percentage ? 1 : 0.75}
				title={node.layoff}
			/>
		{/each}
	</g>
	<g transform="translate({dims.marginLeft}, {dims.height - 16})">
		{#each stages as stage}
			<text
				text-anchor="middle"
				alignment-baseline="middle"
				x={xScale(stage)}
				y="0"
				font-size="16"
				fill={colorScale(stage)}
			>
				{stage}
			</text>
		{/each}
	</g>
</svg>

<style>
	svg {
		border: 1px solid white;
		/* background-color: #eee; */
	}
</style>
