<script>
	//@ts-nocheck
	import * as d3 from 'd3';

	let { normalWidth } = $props();

	let dims = $derived({
		w: normalWidth,
		h: 500,
		marginL: 100,
		marginR: 80,
		marginT: 15,
		marginB: 10
	});

	const linkData = [
		{ source: 'Post-IPO', target: 'Public' },
		{ source: 'Acquired', target: 'Private' },
		{ source: 'Subsidiary', target: 'Private' },
		{ source: 'Private Equity', target: 'Private' },
		{ source: 'Seed', target: 'Early Stage' },
		{ source: 'Series A', target: 'Early Stage' },
		{ source: 'Series B', target: 'Early Stage' },
		{ source: 'Series C', target: 'Mid Stage' },
		{ source: 'Series D', target: 'Mid Stage' },
		{ source: 'Series E', target: 'Late Stage' },
		{ source: 'Series F', target: 'Late Stage' },
		{ source: 'Series G', target: 'Late Stage' },
		{ source: 'Series H', target: 'Late Stage' },
		{ source: 'Series I', target: 'Late Stage' },
		{ source: 'Series J', target: 'Late Stage' },
		{ source: 'Unknown', target: 'Unknown' },
		{ source: 'null', target: 'Unknown' }
	];

	const sources = linkData.map((d) => d.source);
	const targets = [...new Set(linkData.map((d) => d.target))];
	const xScale = $derived(
		d3.scaleOrdinal(['source', 'target'], [dims.marginL, dims.w - dims.marginR])
	);
	const sourceScale = $derived(d3.scaleBand(sources, [dims.marginT, dims.h - dims.marginB]));
	const targetScale = $derived(
		d3.scaleBand(targets, [dims.marginT * 4, dims.h - dims.marginB * 4])
	);
</script>

<svg width={dims.w} height={dims.h}>
	<g class="links" transform="translate(0, {dims.marginT})">
		{#each linkData as lp}
			<path
				d={d3.linkHorizontal()({
					source: [xScale('source'), sourceScale(lp.source)],
					target: [xScale('target'), targetScale(lp.target)]
				})}
			/>
		{/each}
	</g>
	<g class="nodes" transform="translate(0, {dims.marginT})">
		{#each sources as s}
			<text
				x={xScale('source') - 5}
				y={sourceScale(s)}
				text-anchor="end"
				alignment-baseline="middle">{s}</text
			>
		{/each}
		{#each targets as t}
			<text
				x={xScale('target') + 5}
				y={targetScale(t)}
				text-anchor="start"
				alignment-baseline="middle">{t}</text
			>
		{/each}
	</g>
</svg>

<style>
	.links {
		fill: none;
		stroke-width: 1px;
		stroke: var(--color-dark-bg);
	}
	.nodes {
		fill: var(--color-dark-bg);
		font-size: 0.8em;
	}
</style>
