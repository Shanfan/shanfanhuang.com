<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const industries = data.industries;
	const layoffByCompany = data.layoffByCompany;

	const stages = ['Public', 'Private', 'Early Stage', 'Mid Stage', 'Late Stage', 'Unknown'];
	const colors = ['#CC5456', '#88CC54', '#8CD5E1', '#549ECC', '#6E94FC', '#C7C7C7'];
	const chartWidth = 1000;
	const chartHeight = 1200;

	let selectedCompany = $state({ company: 'Company', industry: 'Industry' });

	// Ledgend:
	//   * Show number of companies under each "stage" ledgend
	//   * bubble size
	//   * notation for quantiles
	// * UI: number of layoff filter, industry filter, Slicing filter (1~6)

	// these 3 all need to be changed to states for user input
	const layoffNumBound = [500, 5000];
	const slices = 1;
	const selectedIndustries = ['Finance', 'Retail', 'Consumer', 'Data', 'Crypto', 'Sales'];

	// these will be in $effect() block to take user input
	const filteredData = layoffByCompany.filter(
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
	<div class="graph-containder">
		<div class="color-encoding">
			{#each stages as stage, i}
				<p style="color: {colors[i]}">{stage}</p>
			{/each}
		</div>

		{#each quantiles as q}
			<!-- <p style="color: white">{q}-th quantile</p> -->
			<CompanySwarm
				{stages}
				{colors}
				slicedData={getQuantileData(q)}
				width={chartWidth}
				height={chartHeight / slices}
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
		<div class="billboard">
			<h3>Layoff Events by Company</h3>
			<p>
				{selectedCompany.company} | {selectedCompany.industry} | Total: {d3.format(',')(
					selectedCompany.layoff
				)} ppl laid off
			</p>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Location</th>
						<th>%</th>
						<th>Layoff</th>
					</tr>
				</thead>
				<tbody>
					{#each selectedCompany.events as e}
						<tr>
							<td>{e.date}</td>
							<td>{e.location} <br /> {e.country}</td>
							<td>{e.percentage ? e.percentage : 'N/A'}</td>
							<td>{d3.format(',')(e.layoff)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.graph-containder {
		position: relative;
	}
	.color-encoding {
		display: flex;
		justify-content: space-around;
		margin: 0 80px;
	}
	.billboard {
		position: fixed;
		right: 0;
		top: 30vh;
		padding: 1em;
		width: 25em;
		border-radius: 5px 0 0 5px;
		background-color: white;
		text-align: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
	.billboard h3 {
		margin-top: 0;
	}
	.billboard p {
		font-size: 1em;
	}
	.billboard table {
		width: 100%;
		text-align: left;
		font-size: 0.85em;
	}
	.billboard table td {
		padding: 0.25em 0.5em;
	}
	.billboard table td:last-child,
	.billboard table th:last-child {
		text-align: right;
	}

	.billboard table tbody tr:nth-child(odd) {
		background-color: #f2f2f2;
	}
</style>
