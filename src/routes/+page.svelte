<script>
	//@ts-nocheck
	import TwoByTwo from '$lib/components/TwoByTwo.svelte';

	let { data } = $props();
	let projID = $state();

	const projects = data.projects;
	const projectMap = new Map(
		projects.map((proj) => [
			proj.id,
			{
				title: proj.title,
				description: proj.description,
				link: proj.link,
				imageUrl: proj.imageUrl,
				vidUrl: proj.vidUrl,
				tools: proj.tools
			}
		])
	);

	$inspect(projectMap.get(2));
</script>

<svelte:head>
	<title>Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>

<section class="graph-paper light">
	<TwoByTwo
		{projects}
		whichProj={(id) => {
			projID = id;
		}}
	/>
	<div class="information">
		{#if projID}
			<div class="image">
				{#if projectMap.get(projID).vidUrl}
					<video autoplay muted loop playsinline>
						<source src={'/projects/' + projectMap.get(projID).vidUrl} type="video/mp4" />
						<img src={'/projects/' + projectMap.get(projID).imageUrl} alt="" />
					</video>
				{:else}
					<img src={'/projects/' + projectMap.get(projID).imageUrl} alt="" />
				{/if}
			</div>
			<a href={projectMap.get(projID).link}><h2>{projectMap.get(projID).title}</h2></a>
			<p class="description">{projectMap.get(projID).description}</p>
			<p><span class="label">tools</span> {projectMap.get(projID).tools}</p>
		{:else}
			<h1 class="cursive">Shanfan's Projects</h1>
			<p>Lorem ipsum</p>
		{/if}
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
		color: var(--color-dark-bg);
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1em;
	}

	.graph-paper h1 {
		font-size: 2em;
		color: var(--color-light-blue);
	}

	.graph-paper h2 {
		font-size: 2em;
		margin-top: 0;
	}

	.graph-paper .image img,
	.graph-paper .image video {
		width: 95%;
		border: 0.5em solid #fff;
		transform: rotate(5deg);
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
	}

	.description {
		margin-bottom: 1em;
	}

	.label {
		font-size: smaller;
		text-transform: uppercase;
		color: var(--color-light-blue);
		margin: 0;
	}

	@media (max-width: 960px) {
		.graph-paper {
			padding: 1em;
			background-size: 16px;
		}
		.graph-paper h1,
		.graph-paper h2 {
			font-size: 1.5em;
		}
	}
</style>
