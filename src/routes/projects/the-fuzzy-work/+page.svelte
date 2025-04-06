<script>
	// @ts-nocheck
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';

	let { data } = $props();
	let relationships = data.relationships;
	let industries = data.industries;
	let layoffs = data.layoffs.filter((d) => d.layoff > 1000);

	const stages = ['Public', 'Private', 'Early Stage', 'Mid Stage', 'Late Stage', 'Unknown'];

	// Define graph dimensions
	const dims = {
		width: 800,
		height: 1000,
		marginTop: 50,
		marginLeft: 100,
		marginRight: 50,
		marginBottom: 100
	};

	const bound = {
		width: dims.width - dims.marginLeft - dims.marginRight,
		height: dims.height - dims.marginTop - dims.marginBottom
	};
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div>
	<IndustryFilter {relationships} {industries} />
	<h1 style="color: white">The Fuzzy Work</h1>
	<div class="graph-containder">
		<CompanySwarm {stages} {dims} {bound} {layoffs} />
	</div>
</div>

<style>
</style>
