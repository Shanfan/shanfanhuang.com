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

	$inspect(projectMap.size);
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
						<source src={'/projects' + projectMap.get(projID).vidUrl} type="video/mp4" />
						<img src={'/projects' + projectMap.get(projID).imageUrl} alt="" />
					</video>
				{:else}
					<img src={'/projects' + projectMap.get(projID).imageUrl} alt="" />
				{/if}
			</div>

			{#if projectMap.get(projID).link.startsWith('http')}
				<a href={projectMap.get(projID).link} target="_blank">
					<h2>{projectMap.get(projID).title}</h2>
				</a>
			{:else}
				<a href={projectMap.get(projID).link}>
					<h2>{projectMap.get(projID).title}</h2>
				</a>
			{/if}
			<p class="description">{projectMap.get(projID).description}</p>
			<p><span class="label">tools</span> {projectMap.get(projID).tools}</p>
		{:else}
			<h1 class="cursive">Shanfan's Projects</h1>
			<p>Shanfan</p>
		{/if}
	</div>
</section>

<style>
	.graph-paper {
		width: calc(100vw - 8em);
		max-width: 84em;
		height: 100%;
		margin: 2em auto;
		padding: 1.5em;
		background-color: var(--color-light-bg);
		background-image: url('/grid.png');
		background-repeat: repeat;
		background-size: 24px;
		background-position: -30% -30%;
		border-radius: 10px;
		color: var(--color-dark-bg);
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1em;
	}

	* {
		transition: all ease-in-out 0.5s;
	}

	.graph-paper h1 {
		font-size: 2em;
		color: var(--color-light-blue);
	}

	.graph-paper h2 {
		font-size: 2em;
		margin-top: 0;
	}

	.graph-paper .image {
		transform: translate(1em, 0);
	}

	.graph-paper .image img,
	.graph-paper .image video {
		width: 95%;
		border: 0.75em solid #fff;
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

	@media (max-width: 1024px) {
		.graph-paper {
			width: calc(100vw - 6em);
			margin: 0 auto;
			padding: 1em;
			background-size: 16px;
			grid-template-columns: 1fr;
		}

		.information {
			position: relative;
			padding: 1em 35% 1em 2em;
			border: 3px solid var(--color-light-blue);
		}

		.information .image {
			position: absolute;
			right: -2em;
			top: -3em;
			width: 33%;
		}

		.information .image img,
		.information .image video {
			border-width: 8px;
		}
	}

	@media (max-width: 640px) {
		.graph-paper {
			width: calc(100vw - 4em);
		}
		.information {
			padding: 1em 2em;
		}
		.information .image {
			position: unset;
			width: 70%;
			transform: translate(30%, -5%);
		}
		.information .image img,
		.information .image video {
			border-width: 6px;
		}
	}
</style>
