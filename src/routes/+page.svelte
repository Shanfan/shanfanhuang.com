<script>
	//@ts-nocheck
	import TwoByTwo from '$lib/components/TwoByTwo.svelte';

	let { data } = $props();
	const projects = data.projects;
	const dir = '/projects';
</script>

<svelte:head>
	<title>Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>

<section class="graph-paper">
	<TwoByTwo {projects} />
	<div class="information">
		<h1 class="cursive">Shanfan's Projects</h1>
	</div>
</section>

<style>
	.graph-paper {
		width: calc(100vw - 10em);
		max-width: 84em;
		height: 100%;
		margin: 2em auto;
		background-color: var(--color-light-bg);
		background-image: url('/grid.png');
		background-repeat: repeat;
		background-size: 24px;
		background-position: -30% -30%;
		border-radius: 10px;
		padding: 1.5em;
		color: var(--color-light-blue);
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1em;
	}

	.graph-paper h1 {
		font-size: 2em;
	}

	.graph-paper h2 {
		text-transform: lowercase;
		font-size: 2em;
		margin-top: 0;
	}

	.graph-paper .image img,
	.graph-paper .image video {
		width: 100%;
		border-radius: 0.5em;
	}

	.description,
	.sources {
		margin-bottom: 1em;
	}

	.label {
		font-size: smaller;
		text-transform: uppercase;
		color: var(--color-lighter-blue);
		margin: 0;
	}

	.meta p {
		margin-top: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
	}

	@media (max-width: 720px) {
		.graph-paper {
			padding: 2em;
		}
		.graph-paper h1 {
			font-size: 1.5em;
		}
	}
</style>
