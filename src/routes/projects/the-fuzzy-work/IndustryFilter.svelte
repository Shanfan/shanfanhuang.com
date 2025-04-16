<script>
	// @ts-nocheck
	import * as d3 from 'd3';

	let {
		relationships,
		industries,
		selectedIndustries = $bindable(),
		allIndustriesSelected
	} = $props();

	let nodeData = industries.map(({ industry, ...rest }) => ({
		id: industry,
		...rest,
		isSelected: true
	}));
	let linkData = relationships.map((l, i) => ({
		source: l.Source,
		target: l.Target,
		value: l.Strength,
		isSelected: true
	}));

	const dimensions = {
		width: 600,
		height: 600,
		marginTop: 50,
		marginLeft: 50,
		marginRight: 50,
		marginBottom: 50
	};
	const boundRect = {
		width: dimensions.width - dimensions.marginLeft - dimensions.marginRight,
		height: dimensions.height - dimensions.marginTop - dimensions.marginBottom
	};

	const fontSizeAccessor = (d) => d.ppl_laidoff;

	let fontSizeScale = d3
		.scaleLinear()
		.domain(d3.extent(nodeData, fontSizeAccessor))
		.range([16, 32]);

	function findSelection(n) {
		const linkedIndustries = {
			[n.id]: true
		};

		links.forEach((link) => {
			if (link.value !== 0 && (link.source.id === n.id || link.target.id === n.id)) {
				link.isSelected = true;
				linkedIndustries[link.target.id] = true;
				linkedIndustries[link.source.id] = true;
			} else {
				link.isSelected = false;
			}
		});

		nodes.forEach((node) => {
			if (linkedIndustries[node.id]) {
				node.isSelected = true;
			} else {
				node.isSelected = false;
			}
		});

		selectedIndustries = Object.keys(linkedIndustries);
	}

	function keyDownNode(e, n) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			findSelection(node);
		}
	}

	let nodes = $state(nodeData),
		links = $state(linkData);

	const simulation = d3.forceSimulation(nodes).force(
		'link',
		d3
			.forceLink(links)
			.id((d) => d.id)
			.distance((d) => (d.value === 2 ? boundRect.height / 6 : boundRect.height))
	);

	/**
	 * Action: make an element draggable inside a D3 force‑simulation.
	 *
	 * Usage:
	 * <text use:handleDrag={{ datum: node }}>…</text>
	 */
	function handleDrag(el, datum) {
		// Attach this node’s datum so D3 can read/write to it
		d3.select(el).datum(datum);

		$effect(() => {
			// ─── Setup (runs on mount) ──────
			const behavior = d3
				.drag()
				.on('start', (event) => {
					if (!event.active) simulation.alphaTarget(0.3).restart();
					datum.fx = datum.x;
					datum.fy = datum.y;
				})
				.on('drag', (event) => {
					datum.fx = event.x;
					datum.fy = event.y;
				})
				.on('end', (event) => {
					if (!event.active) simulation.alphaTarget(0);
					datum.fx = datum.fy = null;
				});

			// Apply the drag behaviour
			d3.select(el).call(behavior);

			// ─── Teardown (runs on unmount) ──────
			return () => {
				// Remove every listener in the `.drag` namespace
				d3.select(el).on('.drag', null);
			};
		});
	}

	$effect(() => {
		simulation
			.force('center', d3.forceCenter(boundRect.width / 2, boundRect.height / 2))
			.force('x', d3.forceX(boundRect.width / 2).strength(0.3))
			.force('y', d3.forceY(boundRect.height / 2).strength(0.3))
			.force('collide', d3.forceCollide((d) => fontSizeScale(fontSizeAccessor(d))).strength(0.85));

		return () => {
			simulation.stop();
		};
	});
</script>

<svg viewBox="0, 0, {dimensions.width}, {dimensions.height}">
	<text
		text-anchor="middle"
		alignment-baseline="middle"
		x={dimensions.width / 2}
		y={dimensions.height / 2}
		fill="#333"
		font-size="160">TECH</text
	>
	<g class="links" transform="translate({dimensions.marginLeft}, {dimensions.marginTop})">
		{#each links as link}
			{#if link.value > 0}
				<line
					x1={link.source.x}
					y1={link.source.y}
					x2={link.target.x}
					y2={link.target.y}
					stroke-width="1"
					stroke={link.isSelected && !allIndustriesSelected ? '#ddd' : '#444'}
					opacity={link.value === 2 ? 0.7 : 0.5}
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
				font-size={fontSizeScale(fontSizeAccessor(node))}
				fill={node.isSelected && !allIndustriesSelected ? '#eee' : '#888'}
				role="button"
				aria-label={'industry: ' + node.id}
				tabindex="0"
				onclick={() => findSelection(node)}
				onkeydown={(event) => keyDownNode(node, event)}
				use:handleDrag={node}
			>
				{node.id}
			</text>
		{/each}
	</g>
</svg>

<style>
	svg {
		background: #0f0f0f;
		border-radius: 50%;
	}

	text {
		user-select: none;
	}

	.nodes text:hover {
		cursor: pointer;
		fill: #eee;
	}
	.nodes text:focus {
		outline: none;
	}
	.links {
		mix-blend-mode: lighten;
	}
</style>
