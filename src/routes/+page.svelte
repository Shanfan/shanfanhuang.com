<script>
	//@ts-nocheck
	import TwoByTwo from '$lib/components/TwoByTwo.svelte';
	import { quintInOut, quintOut } from 'svelte/easing';
	import { crossfade, fade, slide, fly } from 'svelte/transition';

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

	const [send, receive] = crossfade({
		duration: 300,
		easing: quintInOut,
		fallback(node, params) {
			return {
				duration: 300,
				easing: quintOut,
				css: (t) => `opacity: ${t};
					filter: blur(${(1 - t) * 4}px);`
			};
		}
	});
</script>

<svelte:head>
	<title>Shanfan's Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=open_in_new"
	/>
</svelte:head>

<section class="graph-paper light">
	<h1 style="text-align: center">Shanfan's Projects</h1>
	<h2 style="text-align: center; font-weight: 200">
		My work invites people to see the familiar in unfamiliar ways.
	</h2>
	<div class="description">
		<p>
			Some of my projects are expressive and playful, like comics or children's books. Others are
			analytical, like data essays and infographics. Some are hand-crafted, others built in code. If
			we plot all my projects in a 2x2 chart, they will look like this: ⬇︎
		</p>
	</div>

	<div>
		<TwoByTwo
			{projects}
			whichProj={(id) => {
				projID = id;
			}}
		/>
	</div>

	<div class="information">
		{#if projID}
			{#key projID}
				<div in:receive={{ key: projID }} out:send={{ key: projID }} class="image">
					{#if projectMap.get(projID).vidUrl}
						<video autoplay muted loop playsinline>
							<source src={'/projects' + projectMap.get(projID).vidUrl} type="video/mp4" />
							<img src={'/projects' + projectMap.get(projID).imageUrl} alt="" />
						</video>
					{:else}
						<img
							src={'/projects' + projectMap.get(projID).imageUrl}
							alt={`Image of ${projectMap.get(projID)}`}
						/>
					{/if}
				</div>
			{/key}

			<div class="description">
				{#if projectMap.get(projID).link.startsWith('http')}
					<a href={projectMap.get(projID).link} target="_blank">
						<h2 class="cursive">
							{projectMap.get(projID).title}
							<span class="material-symbols-outlined">open_in_new</span>
						</h2>
					</a>
				{:else}
					<a href={projectMap.get(projID).link}>
						<h2 class="cursive">{projectMap.get(projID).title}</h2>
					</a>
				{/if}
				<p>
					{@html projectMap.get(projID).description}
				</p>
				<p><span class="label">tools</span> {projectMap.get(projID).tools}</p>
			</div>
		{:else}
			<div>
				<p>
					Each square motif represents a project: its colors are drawn from the project’s visual
					content, and its size reflects the effort involved. ⬆︎Click the motifs to explore.
				</p>
				<p>
					Regardless of form or medium, I believe good design earns trust with subtlety, and rarely
					demands attention. Like a backstage crew dressed in black, <i>good design</i><sup>TM</sup>
					stays out of the spotlight while holding the show together. It helps people orient, reflect,
					and reimagine.
				</p>
				<p><a href="/about">More about me...</a></p>
			</div>
		{/if}
	</div>
</section>

<style>
	.graph-paper {
		flex-grow: 1;
		align-self: center;
		max-width: 40em;
		margin: 0 4em;
		padding: 2em 3em;
		background-color: var(--color-light-bg);
		background-image: url('/grid.png');
		background-repeat: repeat;
		background-size: 12px;
		border-radius: 10px;
		color: var(--color-dark-bg);
	}

	.graph-paper .image {
		position: relative;
		width: 50%;
		height: auto;
	}

	.graph-paper .image img,
	.graph-paper .image video {
		/* need absolute position to cross fade */
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
		border: 8px solid #fff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
		transform: translate(-15%, -10%) rotate(-7deg);
	}

	.information .description {
		margin-left: 50%;
	}

	.label {
		font-size: smaller;
		text-transform: uppercase;
		color: var(--color-light-blue);
		margin: 0;
	}

	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	@media (max-width: 1024px) {
		.information {
			/* position: relative; */
			/* padding: 1em 40% 1em 2em; */
		}

		/* .information .image {
			position: absolute;
			width: 50%;
			left: 60%;
		}

		.information .image img,
		.information .image video {
			border-width: 5px;
			top: 0;
			left: 0;
		}
		.description {
			margin-top: 0;
		} */
	}

	@media (max-width: 640px) {
		/* .graph-paper {
			margin: 0 1em;
		}
		.information .image img,
		.information .image video {
			border-width: 3px;
			right: 0;
		} */
	}
</style>
