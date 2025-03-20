<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { relationships, industries } = $props();

	let nodeData = industries.map((d) => ({ id: d.industry, count: d.count }));
	let linkData = relationships.map((d) => ({
		source: d.Source,
		target: d.Target,
		value: d.Strength
	}));

	let dimensions = {
		width: 600,
		height: 600,
		marginTop: 50,
		marginLeft: 50,
		marginRight: 50,
		marginBottom: 50
	};
	let boundRect = {
		width: dimensions.width - dimensions.marginLeft - dimensions.marginRight,
		height: dimensions.height - dimensions.marginTop - dimensions.marginBottom
	};

	let fontSizeScale = d3
		.scaleLinear()
		.domain([d3.min(nodeData, (d) => d.count), d3.max(nodeData, (d) => d.count)])
		.range([12, 30]);

	let simulation = d3.forceSimulation(nodeData).force(
		'link',
		d3
			.forceLink(linkData)
			.id((d) => d.id)
			.distance((d) => (d.value === 2 ? 200 : boundRect.height))
	);

	let nodes = $state([]),
		links = $state([]);

	simulation.on('tick', () => {
		nodes = simulation.nodes();
		links = linkData.map((d) => ({ ...d }));
	});

	$effect(() => {
		simulation
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(boundRect.width / 2, boundRect.height / 2))
			.force('x', d3.forceX(boundRect.width / 2).strength(0.3))
			.force('y', d3.forceY(boundRect.height / 2).strength(0.3))
			.force(
				'collide',
				d3
					.forceCollide((d) => fontSizeScale(d.count) * 0.9)
					.strength(1)
					.iterations(3)
			);
	});
</script>

<div>
	<svg
		width={dimensions.width}
		height={dimensions.height}
		viewBox="0, 0, {dimensions.width}, {dimensions.height}"
	>
		<g class="links" transform="translate({dimensions.marginLeft}, {dimensions.marginTop})">
			{#each links as link}
				{#if link.value > 0}
					<line
						x1={link.source.x}
						y1={link.source.y}
						x2={link.target.x}
						y2={link.target.y}
						stroke="#ddd"
						stroke-width="1"
						opacity={link.value === 2 ? 0.7 : 0.2}
					/>
				{/if}
			{/each}
		</g>
		<g class="nodes" transform="translate({dimensions.marginLeft}, {dimensions.marginTop})">
			{#each nodes as node}
				<text
					text-anchor="middle"
					alignment-baseline="middle"
					x={node.x}
					y={node.y}
					font-size={fontSizeScale(node.count)}
				>
					{node.id}
				</text>
			{/each}
		</g>
	</svg>
</div>

<style>
	svg {
		background: #fff;
		border-radius: 50%;
	}
</style>
