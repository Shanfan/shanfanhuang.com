<script>
	// @ts-nocheck
	let { data } = $props();
	let relationships = data.relationships;
	let industries = data.industries;
	let layoffs = data.layoffs;

	import IndustryFilter from './IndustryFilter.svelte';
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div>
	<IndustryFilter {relationships} {industries} />
	<!-- Todo: Needs a "back" button to go back to home page -->
	<h1 style="color: white">The Fuzzy Work</h1>
	<!-- Todo: Listing all the projects-->
</div>
