<script>
	//@ts-nocheck
	import './style.css';
	import * as d3 from 'd3';
	import { getContext } from 'svelte';

	let { data } = $props();
	let measure = $state('bankrupted');
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

	const industries = [...pivotMap.keys()];
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
				<p class="vertical-txt header" style="color: {colorScale(stage)}">{stage}</p>
			{/each}
		</div>
		<p class="vertical-txt header">Total</p>
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
		<div id="svg"></div>
		<!-- table footer: summary -->
		<p class="right-align footer">Total</p>
		<div class="stage-grid">
			{#each stages as stage}
				<p class="center-align footer">
					{d3.format(',')(totalByStage.find((d) => d.key === stage)[measure])}
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
		grid-template-columns: 8em 1fr 5em;
		background: #0f0f0f;
	}
	#heatmap-chart p {
		margin: 0.2em 0.75em;
	}

	#svg {
		background-color: #666;
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
	.vertical-txt {
		writing-mode: vertical-lr;
		text-orientation: sideways;
		transform: rotate(180deg);
	}
	.header,
	.footer {
		padding: 0.5em 0;
	}
</style>
