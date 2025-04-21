<script>
	//@ts-nocheck
	import './style.css';
	import * as d3 from 'd3';
	import { getContext } from 'svelte';
	import { scale } from 'svelte/transition';

	let { data } = $props();
	let measure = $state('bankrupted');

	let dims = $state({
		w: null,
		h: null
	});

	const colorScale = getContext('stageColor');
	const stages = getContext('stages');
	const totalByIndustry = getContext('industryData');
	const totalByStage = getContext('stageData');

	const pivotMap = d3.rollup(
		data,
		(v) => {
			return {
				companies: v.length,
				bankrupted: v.filter((u) => u.percentage === 100).length,
				ppl_laidoff: d3.sum(v, (u) => u.layoff)
			};
		},
		(d) => d.industry,
		(d) => d.stage
	);

	const measureMax = {
		companies: d3.max(pivotMap.values(), (inner) => d3.max(inner.values(), (d) => d.companies)),
		bankrupted: d3.max(pivotMap.values(), (inner) => d3.max(inner.values(), (d) => d.bankrupted)),
		ppl_laidoff: d3.max(pivotMap.values(), (inner) => d3.max(inner.values(), (d) => d.ppl_laidoff))
	};

	function formatK(number) {
		return number > 1000 ? String(number).slice(0, -3) + 'k' : number;
	}

	const industries = [...pivotMap.keys()];

	let marginTop = $derived(dims.h / industries.length / 2);
	let marginLeft = $derived(dims.w / stages.length / 2);
	let yScale = $derived(d3.scaleBand().range([0, dims.h]).domain(industries));
	let xScale = $derived(d3.scaleBand().range([0, dims.w]).domain(stages));
	let rScale = $derived(d3.scaleSqrt().range([0, marginTop]).domain([0, measureMax[measure]]));

	$inspect(measureMax);
</script>

<div class="main-content">
	<fieldset>
		<legend>Choose which measure to visualize</legend>
		<div>
			<label
				><input bind:group={measure} type="radio" name="measure" value="companies" /> All companies</label
			>
			<label
				><input bind:group={measure} type="radio" name="measure" value="ppl_laidoff" /> Jobs eliminated</label
			>
			<label
				><input bind:group={measure} type="radio" name="measure" value="bankrupted" /> 100% layoff</label
			>
		</div>
	</fieldset>
	<div id="heatmap-chart">
		<!-- First row - table header -->
		<p class="header"></p>
		<div class="stage-grid">
			{#each stages as stage}
				<p class="vertical-text header" style="color: {colorScale(stage)}">{stage}</p>
			{/each}
		</div>
		<p class="vertical-text header label-text">Total</p>
		<!--Body of data -->
		{#each industries as ind}
			<p class="right-align">{ind}</p>
			<!-- {#each stages as stage, i}
					<p style="color: {colorScale(stage)}" class="center-align">
						{pivotMap.get(ind)?.get(stage)?.[measure] ?? ''}
					</p>
				{/each} -->
			<p class="right-align">
				{d3.format(',')(totalByIndustry.find((d) => d.key === ind)[measure])}
			</p>
		{/each}
		<div id="svg" bind:clientWidth={dims.w} bind:clientHeight={dims.h}>
			<svg width="100%" height="100%">
				<g class="axis" transform="translate(0, {marginTop})">
					{#each industries as yAcc}
						<line x1="0" x2={dims.w} y1={yScale(yAcc)} y2={yScale(yAcc)} />
					{/each}
				</g>
				<g class="circles" transform="translate({marginLeft}, {marginTop})">
					{#each industries as yAcc}
						{#each stages as xAcc}
							{#if pivotMap.get(yAcc).get(xAcc)}
								<circle
									r={rScale(pivotMap.get(yAcc).get(xAcc)[measure])}
									fill={colorScale(xAcc)}
									cx={xScale(xAcc)}
									cy={yScale(yAcc)}
									opacity="0.75"
								/>
							{/if}
						{/each}
					{/each}
				</g>
			</svg>
		</div>
		<!-- table footer: summary -->
		<p class="right-align footer label-text">Total</p>
		<div class="stage-grid">
			{#each stages as stage}
				<p class="center-align footer">
					{formatK(totalByStage.find((d) => d.key === stage)[measure])}
				</p>
			{/each}
		</div>
		<div style="justify-self:center; align-self:center;">
			{d3.format(',')(d3.sum(totalByStage, (d) => d[measure]))}
		</div>
	</div>
</div>

<style>
	fieldset div {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	#heatmap-chart {
		display: grid;
		grid-template-columns: 8em minmax(0, 1fr) auto;
		background: #0f0f0f;
	}
	#heatmap-chart p {
		margin: 0.2em 0.75em;
	}

	#svg {
		grid-column: 2;
		grid-row: 2 / span 30;
	}

	.stage-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		align-items: end;
	}
	.right-align {
		text-align: right;
	}
	.center-align {
		text-align: center;
	}
	.vertical-text {
		writing-mode: vertical-lr;
		text-orientation: sideways;
		transform: rotate(-150deg) translate(0.5em, 0.25em);
	}
	.header,
	.footer {
		padding: 0.2em 0 0 0;
	}

	svg {
		border: 1px solid #555;
	}

	.axis {
		stroke-width: 1px;
		stroke: #555;
	}
</style>
