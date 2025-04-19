<script>
	// @ts-nocheck
	import './style.css';
	import * as d3 from 'd3';
	import { setContext } from 'svelte';
	import ComparisonBar from './ComparisonBar.svelte';
	import DeepDiveCompanies from './SwarmChartComponent.svelte';
	import ComparisonBarIndustry from './ComparisonBarIndustry.svelte';
	import ComparisonBarStage from './ComparisonBarStage.svelte';

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

	function rollupByX(string, data = layoffByCompany) {
		const counts = d3.rollups(
			data,
			(v) => {
				return {
					companies: v.length,
					bankrupted: v.filter((d) => d.percentage === 100).length,
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

	setContext('industryData', rollupByX('industry'));
	setContext('stageData', rollupByX('stage'));
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta name="description" content="The Fuzzy Work" />
</svelte:head>

<div class="grid-container">
	<div class="main-content">
		<h1>The Fuzzy Work</h1>
		<h2>2020 ~ 2025: the nebulous shift of the tech industry</h2>
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

	<ComparisonBarIndustry />

	<div class="main-content">
		<h2>Layoff impact on companies at different funding stages</h2>
	</div>
	<div class="main-content">
		<p>
			The chart below compares the number of companies and the number of jobs eliminated at
			different funding stages.
		</p>
		<p>
			Publically traded companies are often large employers, and they could also eliminate the
			largest number of jobs in times of uncertainty.
		</p>
		<p>
			In the past 5 years, {layoffByCompany[0].company} eliminated {d3.format(',')(
				layoffByCompany[0].layoff
			)} jobs in total, making it the top for job loss, followed by {layoffByCompany[1].company},
			eliminating {d3.format(',')(layoffByCompany[1].layoff)} jobs, and {layoffByCompany[2]
				.company}, {d3.format(',')(layoffByCompany[2].layoff)}.
		</p>
		<p>
			Early-stage companies are more susceptible to social-economical shift, hence more likely to
			announce layoffs or even go bankrupted, but they tend to have much less impact on the total
			job loss.
		</p>
		<p>
			Of {bankrupted.length} companies announced 100% layoffs, presumably bankrupted, {bankrupted.filter(
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

	<ComparisonBarStage />

	<DeepDiveCompanies {relationships} {layoffByCompany} />

	<div style="margin-top: 3em;">
		<h2>Closing thoughts</h2>
		<p>
			Data sourced from <a href="https://layoffs.fyi/" target="_blank">Layoffs FYI</a>.In voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For details on what I
			transformed, read <a href="the-fuzzy-work/behind-the-scene">behind the scene</a>
			this project.
		</p>
	</div>
</div>
