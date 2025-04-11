<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';
	import Bulletin from './Bulletin.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const industries = data.industries;
	const layoffByCompany = data.layoffByCompany;

	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];
	const colors = ['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);
	const chartWidth = 600;
	const chartHeight = 1100;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	let selectedCompany = $state({});

	// TO-DOs:
	// 	 * How to get the data from the industry filter?
	//   * How to bind validation function for min & max input?
	//   * Responsiv CSS Grid
	//   * consider whether we want to introduce icon package https://lucide.dev/icons/mouse-pointer-click
	//   * write the copy text

	let slices = $state(2);
	let layoffNumBound = $state([500, 30000]);
	let selectedIndustries = $state(['Finance', 'Retail', 'Consumer', 'Data', 'Crypto', 'Sales']);

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

	function validateMin(v) {
		if (v < layoffNumBound[1]) {
			layoffNumBound[0] = v;
		} else {
			layoffNumBound[0] = layoffNumBound[1] - 100;
		}
	}

	function validateMax(v) {
		if (v > layoffNumBound[0]) {
			layoffNumBound[1] = v;
		} else {
			layoffNumBound[1] = layoffNumBound[0] + 100;
		}
	}
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div class="grid-container">
	<div id="title">
		<h1>The Fuzzy Work</h1>
		<p>
			Technology is impacting many different industries. Between 2020 and 2025, tech companies
			conducted many layoffs. The visualization lets you explore different aspects of the layoff
			events over the past 5 years.
		</p>
	</div>
	<div id="industry-filter">
		<IndustryFilter {relationships} {industries} {selectedIndustries} />
	</div>
	<div id="content-1">
		<h2><span class="cursive">Explore</span> the data</h2>
		<h3>Filter by industry</h3>
		<p>
			Ledge: font size ...; what the linked lines mean. Based on your choice in the industry filter,
			the chart below shows...In voluptate velit esse cillum dolore eu fugiat nulla pariatur.
		</p>
		<button>Reset</button>
	</div>
	<div id="content-2">
		<h3 style="margin-top: 0">Ledgend</h3>
		<p><strong>The colors</strong> represents different funding stages a company is at:</p>
		<ul style="grid-template-columns: 1fr 1fr 1fr;">
			{#each stages as stage}
				<li style="color: {colorScale(stage)}">{stage}</li>
			{/each}
		</ul>
		<p>The stages are plotted across the <strong>X axis</strong>.</p>
		<p>
			Each circle represents a company. <strong>The size</strong> of the circle represent the percentage
			of people laid off from a company:
		</p>
		<ul class="rLedgend" style="grid-template-columns: 1fr 1fr;">
			<li>
				<span style="opacity: 75%; width: {rScale(20) * 2}px; border: 1px solid white;"></span> unknown
			</li>
			<li><span style="width: {rScale(1) * 2}px"></span> 1%</li>
			<li><span style="width: {rScale(50) * 2}px"></span> 50%</li>
			<li><span style="width: {rScale(100) * 2}px"></span> 100%</li>
		</ul>
		<p>
			The circles are plotted along the <strong>Y axis</strong>, the total number of people laid
			off.
		</p>
		<h3 style="margin-top: 3em">Filter by range</h3>
		<p>In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum.</p>
		<div class="range-selector" style="margin-top: 1em">
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

			<lable for="max"
				>Max:
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
		<h3 style="margin-top: 3em">Slice dataset</h3>
		<p>In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum.</p>
		<div class="quantile-slicer">
			<label for="quantiles"
				>Slice into
				<input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				quantiles</label
			>
			{#if slices === 10}
				<p>10 is the maximum slices allowed.</p>
			{/if}
		</div>
	</div>
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
	<div id="content-3">
		<h2><span class="cursive">View</span> layoff events</h2>
		<p>Companies conducted multiple layoff events between 2020 and 2025.</p>

		<Bulletin company={selectedCompany} {colorScale} />
	</div>
	<div id="closing">
		<h2>About the dataset</h2>
		<p>
			In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For
			details on what I transformed, read <a href="">behind the scene</a> case study of this project.
		</p>
	</div>
</div>

<style>
	.grid-container {
		color: #aaa;
		margin: 3em auto;
		padding: 2em;
		max-width: 64em;
		display: grid;
		gap: 2em 1em;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			'industry-filter title' 'industry-filter content-1' 'beeswarm content-2'
			'beeswarm content-3' 'closing closing';
	}

	h1,
	h2,
	h3 {
		color: #eee;
	}

	#title {
		grid-area: title;
	}

	#industry-filter {
		grid-area: industry-filter;
	}
	#beeswarm-graph {
		grid-area: beeswarm;
	}
	#content-1 {
		grid-area: content-1;
	}
	#content-2 {
		grid-area: content-2;
	}
	#content-3 {
		grid-area: content-3;
	}
	#closing {
		grid-area: closing;
		max-width: 64em;
	}

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

	@media (max-width: 550px) {
		.grid-container {
			margin: 2em auto;
			padding: 1em;
			display: grid;
			gap: 1em;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				'title' 'industry-filter' 'content-1' 'content-2'
				'beeswarm' 'content-3';
		}

		.color-encoding {
			font-size: 0.75rem;
		}

		#content-1,
		#content-2,
		#content-3 {
			max-width: 20em;
		}
	}
</style>
