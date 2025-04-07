<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';

	let { data } = $props();
	let relationships = data.relationships;
	let industries = data.industries;
	let layoffs = data.layoffs;

	const stages = ['Public', 'Private', 'Early Stage', 'Mid Stage', 'Late Stage', 'Unknown'];
	const colors = ['#CC5456', '#88CC54', '#8CD5E1', '#549ECC', '#6E94FC', '#C7C7C7'];
	const chartWidth = 1000;
	const chartHeight = 1800;

	// Tooltips for the company bubbles
	//   * need to bring in the original data so that we can load all the layoff events
	//   * Write the UI for it.
	// Ledgend:
	//   * Show number of companies under each "stage" ledgend
	//   * bubble size
	//   * notation for quantiles
	// * UI: number of layoff filter, industry filter, Slicing filter (1~6)

	// these 3 all need to be changed to states for user input
	const layoffNumBound = [500, 30000];
	const selectedIndustries = ['Finance', 'Retail', 'Consumer', 'Data', 'Crypto', 'Sales'];
	const slices = 5;

	// these will be in $effect() block to take user input
	const filteredData = layoffs.filter(
		(d) =>
			d.layoff >= layoffNumBound[0] &&
			d.layoff <= layoffNumBound[1] &&
			selectedIndustries.includes(d.industry)
	);

	const quantileScale = d3
		.scaleQuantile()
		.domain(filteredData.map((d) => d.layoff))
		.range([...Array(slices).keys()].map((i) => i + 1));
	const quantiles = quantileScale.range().sort(d3.descending);

	// Then we slice the data so that we can produce x number of SVGs
	function getQuantileData(n) {
		if (n < 1 || n > slices) {
			throw new Error(`n must be between 1 and ${slices}`);
		}
		return filteredData.filter((d) => quantileScale(d.layoff) === n);
	}
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div>
	<IndustryFilter {relationships} {industries} />
	<!-- <h1 style="color: white">The Fuzzy Work</h1> -->
	<div class="graph-containder">
		<div class="ledgend">
			<div class="color-encoding">
				{#each stages as stage, i}
					<p style="color: {colors[i]}">{stage}</p>
				{/each}
			</div>
		</div>
		{#each quantiles as q}
			<p style="color: white">{q}-th quantile</p>
			<CompanySwarm
				{stages}
				{colors}
				slicedData={getQuantileData(q)}
				width={chartWidth}
				height={chartHeight / slices}
			/>
		{/each}
	</div>
</div>

<style>
	.color-encoding {
		display: flex;
		justify-content: space-around;
		margin: 0 80px;
	}
</style>
