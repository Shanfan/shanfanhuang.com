<script>
	//@ts-nocheck
	import * as d3 from 'd3';
	let { data } = $props();

	let tooltip = $state({
		visibility: false,
		x: 0,
		y: 0,
		content: ''
	});

	const filteredData = data.filter((d) => d.deficit_reserve < 15);
	const incomeLevels = ['HI', 'UM', 'LM', 'LI'];
	const regions = [
		'North America',
		'Central America/Caribbean',
		'South America',
		'Middle East/Central Asia',
		'Asia-Pacific',
		'EU-27',
		'Other Europe',
		'Africa'
	];
	const colors = [
		'#E81465',
		'#EF861C',
		'#EFD01C',
		'#AAC944',
		'#3DCC93',
		'#6EB5F8',
		'#2A59E4',
		'#5D25A6'
	];

	let dims = $state({
		w: null,
		ratio: 0.7,
		marginLeft: 40,
		marginRight: 10,
		marginBottom: 60,
		marginTop: 10
	});

	let bound = $derived({
		w: dims.w - dims.marginLeft - dims.marginRight,
		h: dims.w * dims.ratio - dims.marginTop - dims.marginBottom
	});

	let bandScale = $derived(d3.scaleBand().domain(incomeLevels).range([0, bound.h]));
	let symScale = $derived(d3.scaleSymlog().domain([-14, 16]).range([0, bound.w]));
	let rScale = $derived(
		d3
			.scaleSqrt()
			.domain([10, 150])
			.clamp(true)
			.range([5, bound.w / 40])
	);

	const colorScale = d3.scaleOrdinal().domain(regions).range(colors);

	const ticks = [-10, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 10];

	let nodes = $derived(
		filteredData.map((n, i) => ({
			...n,
			index: i,
			x: bound.w / 2 + dims.marginLeft,
			y: bound.h + dims.marginTop
		}))
	);

	let nodeState = $derived(nodes);

	function showTooltip(e, node) {
		tooltip.visibility = true;
		tooltip.x = e.offsetX;
		tooltip.y = e.offsetY - 50;
		tooltip.content = node.country;
	}

	function hideTooltip() {
		tooltip.visibility = false;
	}

	$effect(() => {
		const simulation = d3
			.forceSimulation(nodes)
			.force(
				'collide',
				d3.forceCollide().radius((d) => rScale(d.population) + 1)
			)
			.force(
				'x',
				d3.forceX().x((d) => symScale(d.deficit_reserve))
			)
			.force(
				'y',
				d3.forceY().y((d) => bandScale(d.income_group))
			)
			.restart();
		simulation.on('tick', () => {
			nodeState = simulation.nodes();
		});
	});
</script>

<div bind:clientWidth={dims.w} class="breakout chart-wrapper">
	<svg width="100%" height="100%" viewBox="0 0 {dims.w} {dims.w * dims.ratio}">
		<defs>
			<linearGradient id="safeZone">
				<stop offset="0%" stop-color="white" />
				<stop offset="50%" stop-color="var(--color-lightest-blue)" />
				<stop offset="100%" stop-color="white" />
			</linearGradient>
		</defs>
		<rect
			x={symScale(-0.5) + dims.marginLeft}
			y={dims.marginTop}
			width={symScale(0.5) - symScale(-0.5)}
			height={bound.h}
			fill="url('#safeZone')"
		/>
		<g
			transform="translate({dims.marginLeft}, {dims.marginTop + bound.h / incomeLevels.length / 2})"
		>
			{#each incomeLevels as lvl}
				<line class="y-axis" y1={bandScale(lvl)} x2={bound.w} y2={bandScale(lvl)} />
				<text class="label" text-anchor="end" y={bandScale(lvl)} dx="-0.5em" dy="0.3em">{lvl}</text>
			{/each}
			<g class="beeswarm">
				{#each nodeState as node}
					<circle
						cx={node.x}
						cy={node.y}
						r={rScale(+node.population)}
						fill={colorScale(node.region)}
						data-country={node.country}
						data-population={node.population}
						onmouseenter={(e) => showTooltip(e, node)}
						onmouseleave={hideTooltip}
						role="contentinfo"
						aria-details={node.country + ' has a population of ' + node.population + ' millions.'}
					/>
				{/each}
			</g>
		</g>
		<g transform="translate({dims.marginLeft}, {dims.marginTop + bound.h})">
			{#each ticks as tick}
				<g transform="translate({symScale(tick)}, 0)">
					<line class="x-axis" y2="6" />
					<text class="label" dy="1em" y="6" text-anchor="middle">{tick}</text>
				</g>
			{/each}
		</g>
		<rect
			x={dims.marginLeft}
			y={dims.marginTop}
			width={bound.w}
			height={bound.h}
			fill="none"
			stroke="var(--color-light-blue)"
		/>
		<text
			text-anchor="middle"
			x={dims.w / 2}
			y={dims.w * dims.ratio - dims.marginTop}
			fill="var(--color-dark-bg)">Ecological Footprint Balance - 2022 Data</text
		>
	</svg>
	{#if tooltip.visibility}
		<div class="tooltip" style="top: {tooltip.y}px; left: {tooltip.x}px">
			{@html tooltip.content}
		</div>
	{/if}
</div>
<div class="legend">
	<p>Colors:</p>
	<div class="legend-list">
		{#each regions as reg}
			<p><span style="background: {colorScale(reg)}; width: 1em; height: 1em"></span>{reg}</p>
		{/each}
	</div>
	<p>Size:</p>
	<div class="legend-list">
		<p>
			<span
				style="background: var(--color-dark-bg); width: {rScale.range()[0] *
					2}px; height: {rScale.range()[0] * 2}px"
			></span>
			Population &lt;&equals; 10M
		</p>
		<p>
			<span
				style="background: var(--color-dark-bg); width: {rScale.range()[1] *
					2}px; height: {rScale.range()[1] * 2}px"
			></span>
			Population &gt;&equals; 150M
		</p>
	</div>
	<p>Y axis</p>
	<div class="legend-list">
		<p>HI: High income</p>
		<p>LI: Low income</p>
		<p>UM: Upper middle income</p>
		<p>LM: Lower middle income</p>
	</div>
</div>

<style>
	svg {
		background: white;
		border-radius: 10px;
	}

	.y-axis {
		stroke-width: 1px;
		stroke: var(--color-light-blue);
		stroke-dasharray: 2px 4px;
	}
	.x-axis {
		stroke-width: 1px;
		stroke: var(--color-dark-bg);
	}
	.label {
		fill: var(--color-dark-bg);
		font-size: 0.8em;
		font-weight: 400;
	}
	.legend {
		margin: 1em auto;
	}
	.legend-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em 1.5em;
		background: white;
		padding: 0.5em 0 0.5em 1em;
		border-radius: 10px;
	}

	.legend-list p {
		margin: 0;
		display: flex;
		align-items: center;
	}

	.legend-list span {
		display: inline-block;
		border-radius: 50%;
		margin-right: 0.5em;
	}

	.chart-wrapper {
		position: relative;
	}

	.tooltip {
		position: absolute;
		background: var(--color-dark-bg);
		color: var(--color-light-bg);
		z-index: 999;
		padding: 0.5em;
		box-shadow: 0 2px 5px;
		border-radius: 4px;
		transform: translate(-50%, -30%);
	}
</style>
