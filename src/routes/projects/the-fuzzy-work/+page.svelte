<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';
	import Bulletin from './Bulletin.svelte';
	import ComparisonBar from './ComparisonBar.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const layoffByCompany = data.layoffByCompany.sort((a, b) => d3.descending(a.layoff, b.layoff));
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
		<p>
			The chart below compares the number of companies announced layoff events and the number of
			jobs eliminated in each industry.
		</p>
	</div>
	<div class="main-content">
		<ComparisonBar data={rollupByX('industry')} measure={'Industry'} />
		<p>Note that the definition of an industry can be ambiguous.</p>
		<p class="footnote">
			&ldquo;Other&rdquo; included companies such as Microsoft, Miro, Oracle, and Asana.
		</p>
		<p class="footnote">
			&ldquo;Infrastructure&rdquo; refers to information networking companies such as Cisco, VMware,
			New Relic, Docker, and BitTorrent.
		</p>
		<p class="footnote">
			Google and Meta are classified under &ldquo;Consumer&rdquo;, whereas Apple is in
			&ldquo;Hardware&rdquo; and Amazon &ldquo;Retail&rdquo;, although they all have businesses in
			different industries.
		</p>
	</div>
	<aside>
		<p class="insight">
			Relatively few hardware companies made layoff announcements, yet the jobs eliminated in this
			field is quite high.
		</p>
		<p class="insight">
			Consumer, Retail, Transportation, and Finance are among the top industries that slashed jobs
			in past five years.
		</p>
		<p>Click on an industry in the chart to see details.</p>
	</aside>
	<div class="main-content">
		<h2>Layoff impact on companies at different funding stages</h2>
	</div>
	<div class="main-content">
		<p>
			The chart below compares the number of companies and the number of jobs eliminated at
			different funding stages.
		</p>
		<p>
			Publically traded companies are often the large employers, and they could also eliminate the
			largest number of jobs in times of uncertainty.
		</p>
		<p>
			In the past 5 years, {layoffByCompany[0].company} eliminated {layoffByCompany[0].layoff} jobs in
			total, making it to the top for job loss, followed by {layoffByCompany[1].company},
			eliminating {layoffByCompany[1].layoff} jobs, and {layoffByCompany[2].company}, {layoffByCompany[2]
				.layoff}.
		</p>
		<p>
			Early-stage companies are more susceptible to economic shifts at large, hence more likely to
			announce layoffs or even go bankrupted, but they tend to have much less impact on the job
			loss.
		</p>
		<p>
			Of {bankrupted.length} companies announced 100% layoffs, assuming bankrupcy, {bankrupted.filter(
				(d) => d.stage === 'Early Stage'
			).length} are at an early funding stage. That is, 1 in 3 companies announced 100%-layoff is at
			early funding stage.
		</p>
	</div>
	<aside>
		<p class="insight">
			Among all the tech giants, Apple only eliminated {layoffByCompany.find(
				(d) => d.company === 'Apple'
			)?.layoff} jobs, and
			<a
				href="https://www.macrumors.com/2024/11/05/apple-employee-count-grew-this-year/"
				target="_blank"
			>
				MacRumors says
			</a> Apple's employee count had grown slightly dispite the layoffs.
		</p>
	</aside>
	<div class="main-content">
		<ComparisonBar data={rollupByX('stage')} measure={'Stage'} />
		<p class="footnote">
			"Unknown" stage companies included Everlane, SoundCloud, ByteDance, and Huawei.
		</p>
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
		max-width: 85em;
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

	.footnote {
		font-style: italic;
	}

	.insight::before {
		content: '💡 ';
		font-size: 1.5em;
	}

	.insight {
		opacity: 60%;
	}

	.insight:hover,
	.insight:focus {
		opacity: 100%;
		cursor: pointer;
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
