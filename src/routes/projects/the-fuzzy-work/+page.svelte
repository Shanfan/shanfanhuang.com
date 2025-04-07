<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';

	let { data } = $props();
	let relationships = data.relationships;
	let industries = data.industries;
	let layoffs = data.layoffs.filter((d) => d.layoff > 800);

	const stages = ['Public', 'Private', 'Early Stage', 'Mid Stage', 'Late Stage', 'Unknown'];

	const SLICES = 4;

	// Slice the data
	const quantileScale = d3
		.scaleQuantile()
		.domain(layoffs.map((d) => d.layoff))
		.range([...Array(SLICES).keys()].map((i) => i + 1));

	const quantiles = quantileScale.range().sort(d3.descending);
	const threasholds = quantileScale.quantiles();
	console.log(d3.extent(getQuantileData(SLICES), (d) => d.layoff));

	function getQuantileData(n) {
		if (n < 1 || n > SLICES) {
			throw new Error(`n must be between 1 and ${SLICES}`);
		}
		return layoffs.filter((d) => quantileScale(d.layoff) === n);
	}
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div>
	<IndustryFilter {relationships} {industries} />
	<h1 style="color: white">The Fuzzy Work</h1>
	<div class="graph-containder">
		{#each quantiles as q}
			<CompanySwarm {stages} slicedData={getQuantileData(q)} />
		{/each}
	</div>
</div>

<style>
</style>
