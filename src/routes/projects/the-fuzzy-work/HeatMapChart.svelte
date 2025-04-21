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

<div style="grid-column: 1 / -1;">
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
		{#each stages as stage}
			<p class="center-align header" style="color: {colorScale(stage)}">{stage}</p>
		{/each}
		<p class="right-align header">Total</p>
		<!--Body of data -->
		{#each industries as ind}
			<p class="right-align">{ind}</p>
			{#each stages as stage, i}
				<p style="color: {colorScale(stage)}" class="center-align">
					{pivotMap.get(ind)?.get(stage)?.[measure] ?? ''}
				</p>
			{/each}
			<p class="right-align">
				{d3.format(',')(totalByIndustry.find((d) => d.key === ind)[measure])}
			</p>
		{/each}
		<!-- table footer: summary -->
		<p class="right-align footer">Total</p>
		{#each stages as stage}
			<p class="center-align footer">
				{d3.format(',')(totalByStage.find((d) => d.key === stage)[measure])}
			</p>
		{/each}
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
		grid-template-columns: 8em repeat(6, 1fr) 5em;
		background: #0f0f0f;
	}
	#heatmap-chart p {
		margin: 0.2em 0.75em;
	}
	.right-align {
		text-align: right;
	}
	.center-align {
		text-align: center;
	}
	.header,
	.footer {
		padding: 0.5em 0;
	}
	.bar-container {
		position: relative;
	}
	.bar-hor {
		position: absolute;
		transform: translate(0, -50%);
		height: 0.65em;
	}
	.bar-ver {
		position: absolute;
		transform: translate(50%, 0);
		width: 0.65em;
	}
</style>
