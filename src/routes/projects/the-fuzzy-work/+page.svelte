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

	const stages = ['Public', 'Private', 'Early Stage', 'Mid Stage', 'Late Stage', 'Unknown'];
	const colors = ['#CC5456', '#88CC54', '#8CD5E1', '#549ECC', '#6E94FC', '#e4d787'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const chartWidth = 600;
	const chartHeight = 1100;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	let selectedCompany = $state({});

	// TO-DOs:
	// Ledgend:
	//   * Show number of companies under each "stage" ledgend
	//   * bubble size
	//   * add a top boder color to the layoff details table

	// * Filter UI:
	//   * industry filter,

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

<div>
	<div
		class="info-wrapper"
		style="display: flex;
				width: 100%;"
	>
		<div style="flex-grow: 1; padding: 2em">
			<IndustryFilter {relationships} {industries} {selectedIndustries} />
			<div class="graph-container" style="margin-top: 2em;">
				<div
					class="color-encoding"
					style="display: flex; width: 100%; justify-content: space-around; background: #0f0f0f"
				>
					{#each stages as stage}
						<p style="color: {colorScale(stage)}">{stage}</p>
					{/each}
				</div>

				{#each slicedData as slice}
					{#key slice}
						<CompanySwarm
							{stages}
							{colorScale}
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
		</div>
		<div style="width: 30%">
			<h1>The Fuzzy Work</h1>
			<p>
				Technology is impacting many different industries. Between 2020 and 2025, tech companies
				conducted many layoffs. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
				nostrud exercitation.
			</p>
			<h2><span class="cursive">Explore</span> the data</h2>
			<p>Reading the beeswarm chart below. Ledgend: color encoding; bubble size.</p>
			<h3>👈 Filter by industry</h3>
			<p>
				Ledge: font size ...; what the linked lines mean. Based on your choice in the industry
				filter, the chart below shows...In voluptate velit esse cillum dolore eu fugiat nulla
				pariatur.
			</p>
			<button>Reset Industry Filter</button>
			<h3>👇 Filter by layoff range</h3>
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
			<h3>👇 Slice the dataset into quantiles</h3>
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
			<h2><span class="cursive">View</span> layoff events</h2>
			<p>Companies conducted multiple layoff events between 2020 and 2025.</p>
			<Bulletin company={selectedCompany} {colorScale} />
		</div>
	</div>
	<div
		class="chart-wrapper"
		style="display: flex;
			width: 100%;"
	></div>
</div>

<style>
</style>
