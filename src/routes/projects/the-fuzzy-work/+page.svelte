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
	const colors = ['#CC5456', '#88CC54', '#8CD5E1', '#549ECC', '#6E94FC', '#C7C7C7'];
	const chartWidth = 960;
	const chartHeight = 1200;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	let selectedCompany = $state({ company: 'Company', industry: 'Industry' });

	// TO-DOs:
	// Ledgend:
	//   * Show number of companies under each "stage" ledgend
	//   * bubble size
	//   * (maybe) notation for quantiles

	// General user interactions:
	//   * Add a collapse/expand button for the billboard
	//   * consider what's the best way to show the industry filter

	// * Filter UI:
	// 	 * number of layoff filter,
	//   * industry filter,
	//   * maybe allow for search by company name?

	let slices = $state(3);
	let layoffNumBound = $state([500, 5000]);
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
	<IndustryFilter {relationships} {industries} />
	<div class="chart-wrapper">
		<div class="filter-UI">
			<div class="quantile-slicer">
				<label for="quantiles">Quantiles:</label>
				<input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				{#if slices === 10}
					<p>10 is the maximum slices allowed.</p>
				{/if}
			</div>
			<div class="range-selector">
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
				<br />
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
		</div>
		<div class="graph-container">
			<div class="color-encoding">
				{#each stages as stage, i}
					<p style="color: {colors[i]}">{stage}</p>
				{/each}
			</div>

			{#each slicedData as slice}
				{#key slice}
					<CompanySwarm
						{stages}
						{colors}
						data={slice}
						height={chartHeight / slicedData.length}
						width={chartWidth}
						whichCompany={(node) => {
							selectedCompany = node;
						}}
					/>
				{/key}
			{/each}
			<div class="color-encoding">
				{#each stages as stage, i}
					<p style="color: {colors[i]}">{stage}</p>
				{/each}
			</div>
		</div>
	</div>
	<Bulletin company={selectedCompany} />
</div>

<style>
	.chart-wrapper {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;
	}

	.filter-UI {
		width: 150px;
		color: white;
	}

	.graph-container {
		flex-grow: 1;
	}

	.color-encoding {
		display: flex;
		justify-content: space-around;
		margin: 0 80px;
	}
</style>
