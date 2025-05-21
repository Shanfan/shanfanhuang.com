<script>
	//@ts-nocheck
	import '$lib/components/blog.css';
	import Plot from './Plot.svelte';
	let { data } = $props();
	const footprintData = data.footprintData;
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
		<p>
			Aggregated into a single number, represented as the X axis in the chart below, a negative
			number (deficit) means a country is overconsuming what its environment can afford, and a
			negative number (reserve) means a country lived below its means.
		</p>
	</div>
	<Plot data={footprintData} />
</div>
