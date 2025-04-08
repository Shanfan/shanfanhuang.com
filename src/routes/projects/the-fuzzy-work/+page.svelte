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

	let selectedCompany = $state({ company: 'Company', industry: 'Industry' });

	// Ledgend:
	//   * Show number of companies under each "stage" ledgend
	//   * bubble size
	//   * (maybe) notation for quantiles

	// General user interactions:
	//   * Add a collapse/expand button for the billboard
	//   * consider what's the best way to show the industry filter

	// * Filter UI:
	// 	 * Slicing filter (1~8),
	// 	 * number of layoff filter,
	//   * industry filter,
	//   * maybe allow for search by company name?
	let slices = $state(6);
	let layoffNumBound = $state([500, 5000]);
	let selectedIndustries = $state(['Finance', 'Retail', 'Consumer', 'Data', 'Crypto', 'Sales']);

	let chartHeight = $derived(1000 / slices);

	let filteredData = layoffByCompany.filter(
		(d) =>
			d.layoff >= layoffNumBound[0] &&
			d.layoff <= layoffNumBound[1] &&
			selectedIndustries.includes(d.industry)
	);

	let quantileScale = $derived(
		d3
			.scaleQuantile()
			.domain(filteredData.map((d) => d.layoff))
			.range([...Array(slices).keys()].map((i) => i + 1))
	);
	let quantiles = $derived(quantileScale.range().sort(d3.descending));

	function getQuantileData(n) {
		if (n < 1 || n > slices) {
			throw new Error(`n must be between 1 and ${slices}`);
		}
		return filteredData.filter((d) => quantileScale(d.layoff) === n);
	}

	$effect(() => {});
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div>
	<IndustryFilter {relationships} {industries} />
	<div class="chart-wrapper">
		<div class="filter-UI">
			<h3>Number of people laid off</h3>
			<label for="quantiles">Quantiles:</label>
			<input id="quantiles" type="number" min="1" , max="8" step="1" bind:value={slices} />
		</div>
		<div class="graph-container">
			<div class="color-encoding">
				{#each stages as stage, i}
					<p style="color: {colors[i]}">{stage}</p>
				{/each}
			</div>

			{#each quantiles as q}
				<CompanySwarm
					{stages}
					{colors}
					slicedData={getQuantileData(q)}
					height={chartHeight}
					width={chartWidth}
					whichCompany={(node) => {
						selectedCompany = node;
					}}
				/>
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
