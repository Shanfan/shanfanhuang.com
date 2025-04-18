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

	function getCompanyCountbyStage(data, stage) {
		let count = 0;
		data.forEach((s) => {
			count += s.filter((d) => d.stage === stage).length;
		});

		return count;
	}
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div class="grid-container">
	<div id="intro">
		<h1>The Fuzzy Work</h1>
		<h2>2020 ~ 2025: the nebulous shift of the tech industry</h2>
		<h3>
			Between March 11, 2020 and April 16, 2025, tech companies around the globe conducted series of
			layoffs, impacting people working in many different industries. Interesting highlights I found
			in this dataset includes:
		</h3>
		<p>...</p>
		<p>
			You can explore different aspects of the layoff events over the past 5 years with this
			interactive chart.
		</p>
	</div>
	<aside></aside>
	<div id="industry-impact">
		<ComparisonBar {industries} />
	</div>
	<aside>
		<h3>Layoff impact on industries</h3>
		<p>Click on an industry in the chart to see details.</p>
	</aside>

	<div style="margin-top: 3em;">
		<h2>About the dataset</h2>
		<p>
			Data sourced from <a href="https://layoffs.fyi/" target="_blank">Layoffs FYI</a>.In voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For details on what I
			transformed, read <a href="/projects/the-fuzzy-work/case-study">behind the scene</a> case study
			of this project.
		</p>
	</div>
</div>

<style>
	.grid-container {
		margin: 3em auto;
		padding: 2em;
		max-width: 100em;
		display: grid;
		gap: 1em 2em;
		grid-template-columns: 2fr 1fr;
	}

	h1 {
		color: white;
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

	@media (max-width: 720px) {
		.grid-container {
			margin: 2em auto;
			padding: 1em 2em;
			display: grid;
			gap: 1em;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}

		.color-encoding {
			font-size: 0.75rem;
		}
	}
</style>
