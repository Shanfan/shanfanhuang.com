<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import SwarmChart from './SwarmChart.svelte';
	import Bulletin from './SwarmChartBulletin.svelte';

	let { relationships, layoffByCompany, industries } = $props();
	const allIndustrySelected = Array.from(industries.map((d) => d.key));

	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];
	const colors = ['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);
	let chartWidth = 625;
	let chartHeight = chartWidth * 1.5;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	let slices = $state(1);
	let layoffNumBound = $state([1500, 30000]);
	let selectedCompany = $state({});
	let selectedIndustries = $state(allIndustrySelected);

	let slicedData = $derived.by(() => {
		const filteredData = layoffByCompany.filter(
			(d) =>
				d.layoff >= layoffNumBound[0] &&
				d.layoff <= layoffNumBound[1] &&
				selectedIndustries.includes(d.industry)
		);

		const quantileScale = d3
			.scaleQuantile()
			.domain(filteredData.map((d) => d.layoff))
			.range([...Array(slices).keys()]);

		const quantiles = quantileScale.range().sort(d3.descending);

		let data = [];

		quantiles.forEach((n) => {
			data.push(filteredData.filter((d) => quantileScale(d.layoff) === n));
		});

		return data;
	});

	function getCompanyCountbyStage(data, stage) {
		let count = 0;
		data.forEach((s) => {
			count += s.filter((d) => d.stage === stage).length;
		});

		return count;
	}

	const top20 = d3.sum(layoffByCompany.slice(0, 379), (d) => d.layoff);
	const total = d3.sum(layoffByCompany, (d) => d.layoff);

	$inspect(chartWidth, chartHeight);
</script>

<div>
	<h2>Dive into the dataset</h2>
	<p>
		The layoff pattern follows the 80-20 rule: The top 20% companies are responsible for 80% job
		elimination.
	</p>
	<p>
		That is, of {layoffByCompany.length} companies in the dataset, the top {Math.round(
			layoffByCompany.length / 5
		)} companies eliminated {d3.format(',')(top20)} jobs, out of the total {d3.format(',')(total)} job
		loss.
	</p>

	<p>
		The job elimination per company ranges from {dataExtent[0]}
		to {d3.format(',')(dataExtent[1])}.
	</p>
	<h3 style="margin: 2em 0 0">Filter the data to see more patterns:</h3>

	<div
		style="
			display: grid;
			grid-template-columns: 1fr 1fr;
			margin-bottom: 2em;
		"
	>
		<div>
			<p>Filter data range:</p>
			<lable for="min"
				>Min:
				<input
					id="min"
					type="number"
					min={dataExtent[0]}
					max={dataExtent[1]}
					step="100"
					bind:value={layoffNumBound[0]}
				/>
			</lable>

			<lable for="max">
				Max:
				<input
					id="max"
					type="number"
					min={dataExtent[0]}
					max={dataExtent[1]}
					step="100"
					bind:value={layoffNumBound[1]}
				/>
			</lable>
		</div>
		<div>
			<p>Observe data distribution:</p>
			<label for="quantiles">
				Slice into <input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				quantiles</label
			>

			{#if slices === 10}
				<p class="warning">10 is the maximum slices allowed.</p>
			{/if}
		</div>
	</div>
</div>
<aside></aside>

<div id="beeswarm-graph">
	<div
		class="color-encoding"
		style="display: flex; width: 100%; justify-content: space-around; background: #0f0f0f"
	>
		<p
			style="
						text-transform: uppercase;
						font-size: 0.75em;
						line-height: 200%;
						color: #999;"
		>
			Stage <br /> Count
		</p>
		{#each stages as stage}
			<p style="color: {colorScale(stage)}; text-align: center; font-size: 0.9em;">
				{stage}<br />
				{getCompanyCountbyStage(slicedData, stage)}
			</p>
		{/each}
	</div>

	{#each slicedData as slice}
		{#key slice}
			<SwarmChart
				{stages}
				{colorScale}
				{rScale}
				data={slice}
				height={chartHeight / slicedData.length}
				width={chartWidth}
				whichCompany={(node) => {
					selectedCompany = node;
				}}
			/>
		{/key}
	{/each}
</div>
<aside id="layoff-details">
	<p>
		Each circle represents a company. The circle size corresponds to the percentage of people laid
		off from a company:
	</p>
	<ul class="rLedgend" style="grid-template-columns: repeat(auto-fill);">
		<li>
			<span style="opacity: 75%; width: {rScale(20) * 2}px; border: 1px solid white;"></span> unknown
		</li>
		<li><span style="width: {rScale(1) * 2}px"></span> 1%</li>
		<li><span style="width: {rScale(50) * 2}px"></span> 50%</li>
		<li><span style="width: {rScale(100) * 2}px"></span> 100%</li>
	</ul>

	<Bulletin company={selectedCompany} {colorScale} />
</aside>

<style>
	ul {
		display: grid;
		list-style: none;
		padding: 0.25em;
	}

	li {
		margin: 0.25em 0;
	}
	.rLedgend li {
		display: flex;
		align-items: center;
	}
	.rLedgend span {
		display: block;
		float: left;
		aspect-ratio: 1;
		margin-right: 1em;
		border-radius: 50%;
		background: #cc5456;
	}

	.warning {
		color: #cc5456;
	}
</style>
