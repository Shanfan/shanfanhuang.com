<script>
	//@ts-nocheck
	import '$lib/components/blog.css';
	import Plot from './Plot.svelte';
	import * as d3 from 'd3';
	let { data } = $props();
	const footprintData = data.footprintData;
	const hiIncomehiReserve = footprintData
		.filter((d) => d.income_group === 'HI' && d.deficit_reserve > 0.5)
		.sort((a, b) => d3.ascending(a.density_km, b.density_km));

	$inspect(footprintData.slice(-5));
</script>

<div class="grid">
	<header>
		<h1>Deficit or Reserve?</h1>
		<h2>What the ecological footprint say about economical development</h2>
	</header>
	<div>
		<p>
			<a href="https://www.footprintnetwork.org/our-work/ecological-footprint/" target="_blank"
				>Ecological Footprint</a
			>
			is a metric developed by
			<a href="https://www.footprintnetwork.org/" target="_blank">Global Footprint Network</a> that compares
			the resource demand of individuals, governments, and businesses against Earth's capacity for biological
			regeneration.
		</p>
		<h2>The overview</h2>
		<p>
			Aggregated into a single number, represented as the X axis in the chart below, a negative
			number (deficit) means a country is overconsuming what its environment can afford, and a
			negative number (reserve) means a country lived below its means.
		</p>
		<p>
			What's immediately apparent is that the high-income countries polarized on the balance
			measure.
		</p>
	</div>
	<Plot data={footprintData} />

	<div>
		<h2>The well-to-do</h2>
		From the chart above, we can quickly see this group of countries that have a high income level as
		well as high ecological reserve:
	</div>
	<div class="breakout">
		<figure>
			<img
				width="100%"
				height="auto"
				src="/global-footprint/hiIncome_hireserve.jpg"
				alt="world map showing the countries that has high income as well as high ecological reserve"
			/>
			<figcaption>
				A map showing where the high-income-high-reserve countries are located at.
			</figcaption>
		</figure>
	</div>
	<div>
		<div class="table">
			<div class="row header">
				<p>Country</p>
				<p>Ppl/km<sup>2</sup></p>
				<p>Reserve</p>
				<p>HDI</p>
			</div>
			{#each hiIncomehiReserve as country}
				<div class="row">
					<p>{country.country}</p>
					<p>{country.density_km}</p>
					<p>{country.deficit_reserve}</p>
					<p>{country.HDI}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.table {
		margin: 1em;
	}
	.table .header {
		font-weight: 600;
	}
	.row {
		display: grid;
		grid-template-columns: 8em 1fr 1fr 1fr;
		border-bottom: 1px solid var(--color-dark-bg);
	}
	.row p {
		margin: 0;
	}
</style>
