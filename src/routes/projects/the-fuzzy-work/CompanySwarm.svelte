<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { stages, slicedData, colors, width, height } = $props();

	// Define graph dimensions
	const dims = {
		width: width,
		height: height,
		marginTop: 50,
		marginLeft: 80,
		marginBottom: 50
	};

	const bound = {
		width: dims.width - dims.marginLeft,
		height: dims.height - dims.marginTop - dims.marginBottom
	};

	// Define accessors
	const xAccessor = (d) => d.stage; //shared with colorScale
	const yAccessor = (d) => d.layoff;
	const rAccessor = (d) => (d.percentage ? d.percentage : 20);

	// Define scales: color -> stage, radius -> percentage, y -> layoff, x -> stages
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);

	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 12]);
	const xScale = d3.scaleBand().domain(stages).range([0, bound.width]).paddingOuter(0.5);
	const yScale = d3
		.scaleLinear()
		.domain(d3.extent(slicedData, yAccessor))
		.range([bound.height, 0])
		.nice();

	const yTicks = d3.extent(slicedData, yAccessor);

	const nodes = slicedData.map((n, i) => ({
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
					.strength(0.5)
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

<svg width="100%" height="100%" viewBox="0, 0, {dims.width}, {dims.height}">
	<g class="axix" transform="translate(0, {dims.marginTop})">
		{#each yTicks as tick}
			<line
				x1={dims.marginLeft}
				x2={bound.width + 5}
				y1={yScale(tick)}
				y2={yScale(tick)}
				stroke="#999"
				stroke-dasharray="3"
			/>
			<text
				text-anchor="end"
				alignment-baseline="middle"
				x={dims.marginLeft - 5}
				y={yScale(tick)}
				fill="#999"
			>
				{d3.format(',')(tick)}
			</text>
		{/each}
	</g>

	<g class="circles" transform="translate({dims.marginLeft}, {dims.marginTop})">
		{#each nodeState as node}
			<circle
				cx={node.x}
				cy={node.y}
				r={rScale(rAccessor(node))}
				fill={colorScale(xAccessor(node))}
				stroke={node.percentage ? 'none' : '#fff'}
				opacity={node.percentage ? 1 : 0.75}
				title={node.company}
			/>
		{/each}
	</g>
</svg>

<style>
	svg {
		background-color: #0f0f0f;
		margin: 0.2em 0;
	}
</style>
