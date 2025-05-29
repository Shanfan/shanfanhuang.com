<script>
	//@ts-nocheck
	import * as d3 from 'd3';
	let { projects, whichProj } = $props();
	let plotSize = 680;
	let margin = 30;
	let boundSize = plotSize - margin * 2;
	let xScale = d3.scaleLinear().domain([-6, 6]).range([0, boundSize]);
	let yScale = d3.scaleLinear().domain([-6, 6]).range([boundSize, 0]);
	let sizeScale = d3.scaleOrdinal().domain(['S', 'M', 'L']).range([48, 72, 96]);
	let blurTimeout;

	let projectData = projects.map((d) => {
		const colors = d.colors.split(',');
		const initSize = sizeScale(d.size);
		let sizes = [];
		colors.forEach((c, i) => {
			sizes.push(initSize * Math.pow(2 / 3, i));
		});

		return {
			id: d.id,
			title: d.title,
			colors: colors,
			sizes: sizes,
			position: `${xScale(d.x)}, ${yScale(d.y)}`
		};
	});

	function handleClick(id) {
		clearTimeout(blurTimeout);
		whichProj(id);
	}

	function handleKeydown(e, id) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(id);
		}
	}
</script>

{#snippet arrowAxis(transX, transY, rotate = '0')}
	<g
		class="axis"
		transform="translate({transX}, {transY}) 
                rotate({rotate})"
	>
		<path d="M5 0 L0 5 L5 10" />
		<path transform="translate({boundSize - 3}, 0)" d="M0 0 L5 5 L0 10" />
		<line x1="0" y1="5" x2={boundSize} y2="5" />
	</g>
{/snippet}

{#snippet proj(data, i)}
	<g
		class="proj"
		transform="translate({data.position})"
		data-proj={data.title}
		onclick={() => handleClick(data.id)}
		onkeydown={(e) => handleKeydown(e, data.id)}
		onblur={() => {
			blurTimeout = setTimeout(() => {
				whichProj(null);
			}, 300);
		}}
		role="button"
		aria-label={`Project ${data.title}`}
		tabindex="0"
	>
		{#each data.colors as color, i}
			{#if i % 2}
				<rect
					class="spinning"
					x={-data.sizes[i] / 2}
					y={-data.sizes[i] / 2}
					width={data.sizes[i]}
					height={data.sizes[i]}
					rx="4"
					fill={color}
				/>
			{:else}
				<rect
					x={-data.sizes[i] / 2}
					y={-data.sizes[i] / 2}
					width={data.sizes[i]}
					height={data.sizes[i]}
					rx="4"
					fill={color}
				/>
			{/if}
		{/each}
	</g>
{/snippet}

<div class="wrapper">
	<svg width="100%" viewBox="0, 0, {plotSize}, {plotSize}">
		<g>
			{@render arrowAxis(margin, plotSize / 2)}
			{@render arrowAxis(plotSize / 2, margin, 90)}
			<g class="axis-label">
				<text text-anchor="middle" x={plotSize / 2} y="1em">Dynamic</text>
				<text text-anchor="middle" x={plotSize / 2} y={plotSize}>Static</text>
				<text text-anchor="end" x={plotSize} y={plotSize / 2 - 5}>Analytical</text>
				<text text-anchor="start" x="0" y={plotSize / 2 + 26}>Expressive</text>
			</g>
		</g>
		<g transform="translate({margin}, {margin})">
			{#each projectData as p, i}
				{@render proj(p, i)}
			{/each}
		</g>
	</svg>
</div>

<style>
	.wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.axis {
		stroke: var(--color-light-blue);
		stroke-width: 2px;
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.axis-label {
		fill: var(--color-light-blue);
		font-weight: 600;
		text-transform: uppercase;
		font-size: 1em;
	}

	.spinning {
		animation: spin linear infinite 5s;
	}

	.proj:hover .spinning,
	.proj:focus .spinning {
		animation-play-state: paused;
		cursor: pointer;
	}

	.proj:focus {
		outline: none;
	}

	.proj:focus :first-child {
		stroke: var(--color-accent-on-light);
		stroke-width: 3px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
