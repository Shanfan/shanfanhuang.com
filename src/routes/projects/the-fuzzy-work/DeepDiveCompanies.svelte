<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';
	import Bulletin from './Bulletin.svelte';
	import ComparisonBar from './ComparisonBar.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const industries = data.industries;
	const layoffByCompany = data.layoffByCompany;
	const bankrupted = layoffByCompany.filter((d) => d.percentage === 100);
	const allIndustrySelected = Array.from(industries.map((d) => d.industry));

	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];
	const colors = ['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);
	const chartWidth = 680;
	const chartHeight = 1200;
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
</script>

<div>
	<h2>The beeswarm chart</h2>

	<h3>Legend</h3>

	<p>
		Each circle represents a company.
		<strong>The size</strong> of the circle represent the percentage of people laid off from a company:
	</p>
	<ul class="rLedgend" style="grid-template-columns: 1fr 1fr 1fr 1fr;">
		<li>
			<span style="opacity: 75%; width: {rScale(20) * 2}px; border: 1px solid white;"></span> unknown
		</li>
		<li><span style="width: {rScale(1) * 2}px"></span> 1%</li>
		<li><span style="width: {rScale(50) * 2}px"></span> 50%</li>
		<li><span style="width: {rScale(100) * 2}px"></span> 100%</li>
	</ul>

	<p>
		The <strong>Y axis</strong> marks the number of jobs eliminated in a company, which ranges from {dataExtent[0]}
		to {dataExtent[1]} in entire dataset.
	</p>
	<h3>Filters</h3>
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
<aside>
	<p class="insight">
		Of {layoffByCompany.length} companies announced layoffs, {bankrupted.length} presumably went bankrupted(100%
		layoff).
	</p>
</aside>

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
			<p style="color: {colorScale(stage)}; text-align: center;">
				{stage}<br />
				{getCompanyCountbyStage(slicedData, stage)}
			</p>
		{/each}
	</div>

	{#each slicedData as slice}
		{#key slice}
			<CompanySwarm
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
	<h3>Layoff details</h3>
	<Bulletin company={selectedCompany} {colorScale} />
</aside>
<div style="margin-top: 3em;">
	<h2>About the dataset</h2>
	<p>
		Data sourced from <a href="https://layoffs.fyi/" target="_blank">Layoffs FYI</a>.In voluptate
		velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For details on what I
		transformed, read <a href="/projects/the-fuzzy-work/case-study">behind the scene</a> case study of
		this project.
	</p>
</div>

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

	.insight::before {
		content: '💡 ';
		font-size: 1.5em;
	}

	.insight {
		color: #666;
	}

	.insight:hover,
	.insight:focus {
		color: var(--color-text);
	}
</style>
