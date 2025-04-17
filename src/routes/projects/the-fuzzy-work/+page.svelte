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
	const allIndustrySelected = Array.from(industries.map((d) => d.industry));

	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];
	const colors = ['#CC5456', '#88CC54', '#e4d787', '#8CD5E1', '#549ECC', '#6E94FC'];
	const colorScale = d3.scaleOrdinal().domain(stages).range(colors);
	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);
	const chartWidth = 680;
	const chartHeight = 1200;
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

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
	<div id="intro">
		<h1>The Fuzzy Work</h1>
		<h2>the nebulous shift of the tech industry in 3 charts</h2>
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
		<p>
			Industries highlighted in this graph is used as a filter to show companies in the beeswarm
			chart below.
		</p>
	</div>
	<aside>
		<h2>Layoff impact on industries</h2>
		<p>
			In the original dataset, companies are classified under industries, visualized as a network
			graph here. I denoted related industries with a link (See: <a href="/">Why I did this</a>).
		</p>
		<p>The font size corresponds the number of positions eliminated in that industry.</p>
	</aside>

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
		<p>
			The people laid off by a single company extends from {dataExtent[0]} to {dataExtent[1]}.
		</p>
		<p>
			Filter data by range:
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
		</p>
		<p>
			Observe data distribution by slicing:
			<label for="quantiles">
				<input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				quantiles</label
			>
		</p>
		{#if slices === 10}
			<p class="warning">10 is the maximum slices allowed.</p>
		{/if}
	</div>
	<aside id="layoff-details">
		<h2>How to read the chart</h2>

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
			The <strong>Y axis</strong> marks the total number of positions eliminated in a company.
		</p>
		<h2>View layoff events</h2>
		<p>Companies conducted multiple layoff events between 2020 and 2025.</p>

		<Bulletin company={selectedCompany} {colorScale} />
	</aside>
	<div id="closing">
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
