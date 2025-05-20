<script>
	//@ts-nocheck
	import '$lib/components/blog.css';
	let { data } = $props();
	const footprintData = data.footprintData;
	$inspect(footprintData.slice(-5));
</script>

<div class="grid">
	<h1>Global Footprint</h1>
</div>
