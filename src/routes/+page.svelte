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
		duration: 600,
		easing: quintInOut,
		fallback(node, params) {
			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `opacity: ${t};
					transform: scale(${0.95 + 0.05 * t});
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
	<div class="full-width">
		<h1 class="cursive">Shanfan's Projects</h1>
		<p>Click the markers in the quadrant chart to explore.</p>
	</div>

	<div class="wrapper">
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
						<h1 class="cursive">
							{projectMap.get(projID).title}
							<span class="material-symbols-outlined">open_in_new</span>
						</h1>
					</a>
				{:else}
					<a href={projectMap.get(projID).link}>
						<h1 class="cursive">{projectMap.get(projID).title}</h1>
					</a>
				{/if}
				<p>
					{@html projectMap.get(projID).description}
				</p>
				<p><span class="label">tools</span> {projectMap.get(projID).tools}</p>
			</div>
		{:else}
			<div class="image">
				<img src="/projects/square-jump.gif" alt="hand drawn animation" />
			</div>
			<div class="description">
				<p>
					My work invites people to see the familiar in unfamiliar ways. Some of my projects are
					expressive and playful—like comics or children's books. Others are analytical—like data
					essays and infographics. Some are hand-crafted, others built in code.
				</p>
				<p>
					Regardless of form, I believe good design earns trust with subtlety, instead of demanding
					attention. Like a backstage crew dressed in black, <i>Good Design</i> stays out of the spotlight
					while holding the show together. It helps people orient, reflect, and reimagine.
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.graph-paper {
		flex-grow: 1;
		align-self: center;
		max-width: 84em;
		margin: 0 4em;
		padding: 1.5em;
		background-color: var(--color-light-bg);
		background-image: url('/grid.png');
		background-repeat: repeat;
		background-size: 12px;
		background-position: -30% -30%;
		border-radius: 10px;
		color: var(--color-dark-bg);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em 4em;
	}

	.full-width {
		grid-column: 1 / 3;
	}

	.graph-paper h1 {
		font-size: 2em;
	}

	.graph-paper .image {
		position: relative;
		width: 100%;
		height: auto;
	}

	.graph-paper .image img,
	.graph-paper .image video {
		position: absolute;
		left: 15%;
		top: -10em;
		width: 75%;
		height: auto;
		border: 0.5em solid #fff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
		transform: translate(15%, -15%) rotate(7deg);
	}

	.description {
		margin-top: 50%;
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
		.graph-paper {
			grid-template-columns: 1fr;
		}

		.full-width {
			grid-column: 1;
		}

		.information {
			position: relative;
			padding: 1em 40% 1em 2em;
		}

		.information .image {
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
		}
	}

	@media (max-width: 640px) {
		.graph-paper {
			margin: 0 1em;
		}
		.information .image img,
		.information .image video {
			border-width: 3px;
			right: 0;
		}
	}
</style>
