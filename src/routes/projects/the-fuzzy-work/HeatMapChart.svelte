<script>
	import './style.css';
	import * as d3 from 'd3';
	import { getContext } from 'svelte';

	let { data } = $props();
	const colorScale = getContext('stageColor');
	const stages = colorScale.domain();

	const pivotMap = d3.rollups(
		data,
		(v) => {
			return {
				companies: v.length,
				bankrupted: v.filter((u) => u.percentage === 100).length,
				jobs: d3.sum(v, (u) => u.layoff)
			};
		},
		(d) => d.industry,
		(d) => d.stage
	);

	$inspect(pivotMap);
</script>

<div style="grid-column: 1 / -1;">
	<fieldset>
		<legend>Choose which measure to visualize</legend>
		<div>
			<label><input type="radio" name="measure" value="companies" checked /> Companies</label>
			<label><input type="radio" name="measure" value="jobs" /> Jobs eliminated</label>
			<label><input type="radio" name="measure" value="bankrupted" /> 100% layoff</label>
		</div>
	</fieldset>
</div>

<style>
	fieldset div {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
</style>
