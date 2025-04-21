<script>
	// @ts-nocheck
	import './style.css';
	import * as d3 from 'd3';
	import { setContext } from 'svelte';
	import ComparisonBar from './ComparisonBar.svelte';
	import DeepDiveCompanies from './SwarmChartComponent.svelte';
	import ComparisonBarIndustry from './ComparisonBarIndustry.svelte';
	import ComparisonBarStage from './ComparisonBarStage.svelte';
	import HeatMapChart from './HeatMapChart.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const layoffByCompany = data.layoffByCompany.sort((a, b) => d3.descending(a.layoff, b.layoff));
	const bankrupted = layoffByCompany.filter((d) => d.percentage === 100);
	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];

	const colorScale = d3
		.scaleOrdinal()
		.domain(stages)
		.range(['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC']);

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
	setContext('stageColor', colorScale);
	setContext('stages', stages);
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
			In the original dataset, each row represents a layoff announcement in the news. For the
			purpose of this analysis, I rolled up the announcement data by company. I also simplified the
			classification of the funding stage of a company. See <a
				href="the-fuzzy-work/behind-the-scene">Behind the Scene</a
			> for details.
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
			an early funding stage.
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
	<div class="main-content">
		<h2>How industries and funding stages cross-compare</h2>
		<p>
			If we assume "100% layoff" as bankrupcy, the number of bankrupted companies took up about 4%
			of the enrire set. While 4% is negligible in the bar charts above, bankrupcy in itself is
			still a significant measure to understand the industry shift.
		</p>
		<p>
			The chart below provides options to observe the layoff impact based on companies, jobs, or
			bankrupcy.
		</p>
	</div>

	<HeatMapChart data={layoffByCompany} />
	<aside>
		<p class="insight">
			A large number of companies in "Early Stage" and "Food" industry announced 100%-layoff.
			Further research shows these companies are startups innovating on supplychain and food
			delivery services, most of them non-US companies.
		</p>
		<p class="insight">
			The "Finance" industry across funding stages has the most companies announced layoffs, many
			are Fintech startups.
		</p>
		<p class="insight">
			The the publically traded companies in "Retail", "Consumer", "Hardware", "Other", and
			"Transportation" eliminated most jobs.
		</p>
	</aside>
	<DeepDiveCompanies {relationships} {layoffByCompany} />

	<div style="margin-top: 3em;">
		<h2>Closing thoughts</h2>
		<p>
			The layoffs happenend between 2020 and 2025 in the tech industry were not necessarily a signal
			that the companies weren't doing well. They are part of broader trends reshaping the society,
			driven by the bursting of the tech bubble, which was exacerbated by the COVID stimulus, as
			well as the impact of AI.
		</p>
		<p>
			Joining a tech startup used to be glamourous: WeWork-style offices, getting a "director" title
			before hitting 30, stock options, potential IPO...
		</p>
		<p>
			Being hired by one of the Big Tech used to be reassuring: High compensation, stock equity,
			generous health insurance and 401(k) match, flexible vacation time...
		</p>
		<p>The changes in the past five years, however, remind us of something else:</p>
		<p>Innovation disrupts everything, including innovation itself. ... WIP</p>
		<p>
			For details on how this project came into being, read <a
				href="the-fuzzy-work/behind-the-scene">behind the scene</a
			>
			this project.
		</p>
	</div>
</div>
