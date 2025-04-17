<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { industries } = $props();
	let rangeCom = $state();
	let rangePpl = $state();

	const companyExtent = d3.extent(industries, (d) => d.companies);
	const pplExtent = d3.extent(industries, (d) => d.ppl_laidoff);
	const comScale = $derived(d3.scaleLinear().rangeRound([0, rangeCom]).domain(companyExtent));
	const pplScale = $derived(d3.scaleLinear().rangeRound([0, rangePpl]).domain(pplExtent));
	const bankruptedScale = $derived(
		d3.scaleLinear().rangeRound([0, rangeCom]).domain(companyExtent)
	);
</script>

<div class="header grid-container">
	<p>
		Comapnies announced layoff events <br /> Red <span class="bankrupted"> = bankrupted</span>
	</p>
	<p>Industry</p>
	<p>Positions Eliminated</p>
</div>
<div class="grid-container" style="padding: 0.5em 2em">
	{#each industries as ind, i}
		<div class="bar-container" bind:clientWidth={rangeCom}>
			<div class="company bar" style="width: {comScale(ind.companies)}px"></div>
			<div class="bankrupted bar" style="width: {bankruptedScale(ind.bankrupted)}px"></div>
		</div>
		<p class="ind-name">{ind.industry}</p>
		<div class="bar-container" bind:clientWidth={rangePpl}>
			<div class="ppl bar" style="width: {pplScale(ind.ppl_laidoff)}px"></div>
		</div>
	{/each}
</div>
<div class="footer grid-container">
	<p>Max: {companyExtent[1]} --- Min: {companyExtent[0]}</p>
	<p>Industries: {industries.length}</p>
	<p>Max: {d3.format(',')(pplExtent[1])} --- Min: {pplExtent[0]}</p>
</div>

<style>
	.grid-container {
		--bankrupted: #b3191b;
		background: #0f0f0f;
		display: grid;
		grid-template-columns: 1fr 8em 1fr;
		align-items: center;
	}

	.header,
	.footer {
		text-align: center;
		text-transform: uppercase;
		font-size: 0.85em;
		color: #999;
	}

	.header {
		border-bottom: #555 solid 1px;
	}

	.footer {
		border-top: #555 solid 1px;
	}

	.ind-name {
		text-align: center;
		line-height: 1;
		margin: 0.25em;
	}

	.bar-container {
		position: relative;
	}
	.bar {
		position: absolute;
		transform: translate(0, -50%);
		height: 0.65em;
	}

	.ppl.bar {
		left: 0;
		background: #999;
	}

	.company.bar {
		right: 0;
		background: #999;
	}
	.bankrupted.bar {
		background: var(--bankrupted);
		right: 0;
	}
	.header .bankrupted {
		border-left: 5px solid var(--bankrupted);
		padding: 0 3px;
	}
</style>
