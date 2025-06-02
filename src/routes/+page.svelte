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
</script>

<svelte:head>
	<title>Projects</title>
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
			<div class="image">
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
				<!-- <img
					src="https://sara-snail-cat-cricket.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fch5_sn3_pn1.6b9d516c.jpg&w=1920&q=75"
					alt="A child peaking through a hole and discovering small creatures"
				/> -->
				<img src="/projects/square-jump.gif" alt="hand drawn animation" />
				<!-- <enhanced:img src="/static/projects/the-fuzzy-work.png" /> -->
			</div>
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
		background-size: 16px;
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

	.graph-paper .image img,
	.graph-paper .image video {
		width: 75%;
		height: auto;
		border: 0.5em solid #fff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
		transform: translate(15%, -15%) rotate(7deg);
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
			--img-size: 48%;
			position: relative;
			padding: 1em var(--img-size) 1em 2em;
		}

		.information .image {
			position: absolute;
			right: -2em;
			top: -3em;
			width: var(--img-size);
		}

		.information .image img,
		.information .image video {
			border-width: 8px;
		}
	}

	@media (max-width: 640px) {
		.graph-paper {
			margin: 0 1em;
		}
		.information {
			padding: 1em 2em;
		}
		.information .image {
			position: unset;
			width: 80%;
			transform: translate(30%, 0%);
		}
		.information .image img,
		.information .image video {
			border-width: 6px;
		}
	}
</style>
