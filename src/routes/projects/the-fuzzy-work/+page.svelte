<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import IndustryFilter from './IndustryFilter.svelte';
	import CompanySwarm from './CompanySwarm.svelte';
	import Bulletin from './Bulletin.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const industries = data.industries;
	const layoffByCompany = data.layoffByCompany;
	const allIndustrySelected = Array.from(industries.map((d) => d.industry));

	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];
	const colors = ['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);
	const chartWidth = 680;
	const chartHeight = 1200;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	// TO-DOs:
	//   * write the copy text
	//   * Write behind the scene

	let slices = $state(1);
	let layoffNumBound = $state([1500, 30000]);
	let selectedCompany = $state({});
	let selectedIndustries = $state(allIndustrySelected);

	let slicedData = $derived.by(() => {
		const filteredData = layoffByCompany.filter(
			(d) =>
				d.layoff >= layoffNumBound[0] &&
				d.layoff <= layoffNumBound[1] &&
				selectedIndustries.includes(d.industry)
		);

		const quantileScale = d3
			.scaleQuantile()
			.domain(filteredData.map((d) => d.layoff))
			.range([...Array(slices).keys()]);

		const quantiles = quantileScale.range().sort(d3.descending);

		let data = [];

		quantiles.forEach((n) => {
			data.push(filteredData.filter((d) => quantileScale(d.layoff) === n));
		});

		return data;
	});

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
	<div id="title">
		<h1>The Fuzzy Work</h1>
		<h3>
			Between March 2020 and January 2025, tech companies around the globe conducted series of
			layoffs, impacting people working in many different industries. Interesting highlights I found
			in this dataset includes:
		</h3>
		<p>...</p>
		<p>
			You can explore different aspects of the layoff events over the past 5 years with this
			interactive chart.
		</p>
	</div>
	<div id="industry-filter">
		<IndustryFilter
			{relationships}
			{industries}
			bind:selectedIndustries
			allIndustriesSelected={selectedIndustries.length === industries.length}
		/>
		<div>
			<button
				onclick={() => {
					selectedIndustries = allIndustrySelected;
				}}>Reset Selection</button
			>
			<p>
				Industries highlighted in this graph is used as a filter to show companies in the beeswarm
				chart below.
			</p>
			{#if selectedIndustries.length === industries.length}
				<p>
					<span
						style="
							text-transform: uppercase;
							font-size: 0.75em;
							color: #999;"
					>
						Selected industries
					</span>
					All industries selected
				</p>
			{:else}
				<p>
					<span
						style="
							text-transform: uppercase;
							font-size: 0.75em;
							color: #999;"
					>
						Selected industry
					</span>
					{selectedIndustries[0]}
				</p>
				{#if selectedIndustries.length > 1 && selectedIndustries.length < industries.length}
					<p>
						<span
							style="
							text-transform: uppercase;
							font-size: 0.75em;
							color: #999;"
						>
							Related industries
						</span>
						{#each selectedIndustries as ind, i}
							{#if i !== 0 && i !== selectedIndustries.length - 1}
								{ind} -&nbsp;
							{:else if i === selectedIndustries.length - 1}
								{ind}
							{/if}
						{/each}
					</p>
				{/if}
			{/if}
		</div>
	</div>
	<div id="content-1">
		<h2>Layoff impact on industries</h2>
		<p>
			In the original dataset, companies are classified under 30 industries, visualized as a network
			graph here. I denoted related industries with a link (See: <a href="/">Why I did this</a>).
		</p>
		<p>The font size corresponds the number of companies in that industry.</p>
	</div>
	<div id="content-2">
		<h2 style="margin-top: 0">How to read the chart</h2>

		<p>Each circle represents a company.</p>
		<p>
			<strong>The size</strong> of the circle represent the percentage of people laid off from a company:
		</p>
		<ul class="rLedgend" style="grid-template-columns: 1fr 1fr;">
			<li>
				<span style="opacity: 75%; width: {rScale(20) * 2}px; border: 1px solid white;"></span> unknown
			</li>
			<li><span style="width: {rScale(1) * 2}px"></span> 1%</li>
			<li><span style="width: {rScale(50) * 2}px"></span> 50%</li>
			<li><span style="width: {rScale(100) * 2}px"></span> 100%</li>
		</ul>
		<p>The funding stage of a company is plotted across the <strong>X axis</strong>.</p>

		<p>
			The <strong>Y axis</strong> marks the total number of people laid off from a company.
		</p>

		<h2>Explore data range</h2>
		<p>
			The people laid off by a single company extends from {dataExtent[0]} to {dataExtent[1]}.
		</p>
		<p>Filter the dataset by change the range below:</p>
		<div class="range-selector" style="margin-top: 1em">
			<lable for="min"
				>Min:
				<input
					id="min"
					type="number"
					min={dataExtent[0]}
					max={dataExtent[1]}
					step="100"
					bind:value={layoffNumBound[0]}
				/>
			</lable>

			<lable for="max"
				>Max:
				<input
					id="max"
					type="number"
					min={dataExtent[0]}
					max={dataExtent[1]}
					step="100"
					bind:value={layoffNumBound[1]}
				/>
			</lable>
		</div>
		<p>Dive into data distribution by slicing the dataset into:</p>
		<div class="quantile-slicer">
			<label for="quantiles">
				<input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				quantiles</label
			>
			{#if slices === 10}
				<p>10 is the maximum slices allowed.</p>
			{/if}
		</div>
	</div>
	<div id="beeswarm-graph">
		<div
			class="color-encoding"
			style="display: flex; width: 100%; justify-content: space-around; background: #0f0f0f"
		>
			<p
				style="
						text-transform: uppercase;
						font-size: 0.75em;
						line-height: 200%;
						color: #999;"
			>
				Stage <br /> Count
			</p>
			{#each stages as stage}
				<p style="color: {colorScale(stage)}; text-align: center;">
					{stage}<br />
					{getCompanyCountbyStage(slicedData, stage)}
				</p>
			{/each}
		</div>

		{#each slicedData as slice}
			{#key slice}
				<CompanySwarm
					{stages}
					{colorScale}
					{rScale}
					data={slice}
					height={chartHeight / slicedData.length}
					width={chartWidth}
					whichCompany={(node) => {
						selectedCompany = node;
					}}
				/>
			{/key}
		{/each}
	</div>
	<div id="content-3">
		<h2>View layoff events</h2>
		<p>Companies conducted multiple layoff events between 2020 and 2025.</p>

		<Bulletin company={selectedCompany} {colorScale} />
	</div>
	<div id="closing">
		<h2>About the dataset</h2>
		<p>
			In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Anim id est laborum. For
			details on what I transformed, read <a href="/projects/the-fuzzy-work/case-study"
				>behind the scene</a
			> case study of this project.
		</p>
	</div>
</div>

<style>
	.grid-container {
		color: #aaa;
		margin: 3em auto;
		padding: 2em;
		max-width: 64em;
		display: grid;
		gap: 1em 2em;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto;
		grid-template-areas:
			'title title' 'industry-filter content-1' 'beeswarm content-2'
			'beeswarm content-3' 'closing closing';
	}

	h1,
	h2,
	h3 {
		color: #eee;
	}

	#title {
		grid-area: title;
	}

	#industry-filter {
		grid-area: industry-filter;
	}
	#beeswarm-graph {
		grid-area: beeswarm;
	}
	#content-1 {
		grid-area: content-1;
	}
	#content-2 {
		grid-area: content-2;
	}
	#content-3 {
		grid-area: content-3;
	}
	#closing {
		grid-area: closing;
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

	@media (max-width: 550px) {
		.grid-container {
			margin: 2em auto;
			padding: 1em;
			display: grid;
			gap: 1em;
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			grid-template-areas:
				'title' 'industry-filter' 'content-1' 'content-2'
				'beeswarm' 'content-3' 'closing';
		}

		.color-encoding {
			font-size: 0.75rem;
		}

		#content-1,
		#content-2,
		#content-3 {
			max-width: 20em;
		}
	}
</style>
