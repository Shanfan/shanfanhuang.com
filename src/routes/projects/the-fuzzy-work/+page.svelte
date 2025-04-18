<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';
	import Bulletin from './Bulletin.svelte';
	import ComparisonBar from './ComparisonBar.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const layoffByCompany = data.layoffByCompany;
	const bankrupted = layoffByCompany.filter((d) => d.percentage === 100);

	const pivotMap = d3.rollups(
		bankrupted,
		(v) => v.length,
		(d) => d.industry,
		(d) => d.stage
	);

	// console.log(pivotMap);

	function rollupByX(string) {
		const counts = d3.rollups(
			layoffByCompany,
			(v) => {
				return {
					companies: v.length,
					ppl_laidoff: d3.sum(v, (d) => d.layoff)
				};
			},
			(d) => d[string]
		);
		const countsArray = Array.from(counts, ([name, counts]) => ({
			key: name,
			...counts
		}));
		countsArray.sort((a, b) => d3.descending(a.ppl_laidoff, b.ppl_laidoff));
		return countsArray;
	}
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div class="grid-container">
	<div class="main-content">
		<h1>The Fuzzy Work</h1>
		<h2 class="cursive">2020 ~ 2025: the nebulous shift of the tech industry</h2>
		<p>
			Between March 11, 2020 and April 16, 2025, tech companies around the globe conducted series of
			layoffs, impacting people working in many different industries. This essay explores data
			shared on <a href="https://layoffs.fyi/" target="_blank">Layoffs FYI</a> using interactive charts.
		</p>
		<p>
			To ensure clarity, I rolled up the original dataset, in which each row represents a layoff
			announcement in the news, by company. I also simplified the classification of the funding
			stage of a company. See <a href="the-fuzzy-work/behind-the-scene">Behind the Scene</a> for details.
		</p>
	</div>
	<div class="main-content">
		<h2>Layoff impact on industries</h2>
	</div>
	<div class="main-content">
		<ComparisonBar data={rollupByX('industry')} measure={'Industry'} />
	</div>
	<aside>
		<p>Click on an industry in the chart to see details.</p>
	</aside>
	<div class="main-content">
		<h2>Layoff impact on companies at different funding stages</h2>
	</div>
	<div class="main-content">
		<ComparisonBar data={rollupByX('stage')} measure={'Stage'} />
	</div>
	<aside>
		<p>Click on a stage in the chart to see details.</p>
	</aside>

	<div style="margin-top: 3em;">
		<h2>About the dataset</h2>
		<p>
			Data sourced from <a href="https://layoffs.fyi/" target="_blank">Layoffs FYI</a>.In voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For details on what I
			transformed, read <a href="the-fuzzy-work/behind-the-scene">behind the scene</a>
			this project.
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

	.main-content {
		grid-column: 1 / 1;
	}
	aside {
		grid-column: 2 / 2;
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
