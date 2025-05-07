<script>
	//@ts-nocheck
	let { data } = $props();
	const projects = data.projectData;
	$inspect(projects[0]);
</script>

<svelte:head>
	<title>Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>
<section>
	<h1>Shanfan's Work</h1>
	<p class="cursive">
		Design is a way of thinking, identifying patterns, telling stories, and revealing new
		perspectives.
	</p>
	<div class="projects-container">
		{#each projects as p}
			<div class="card">
				<div class="image"></div>
				<div class="meta">
					<p class="label">Title</p>
					<h2><a href={p.link}>{p.title}</a></h2>
					<p class="label">Overview</p>
					<div class="description">{@html p.description}</div>
					<p class="label">Medium</p>
					<p>{p.medium}</p>
					<p class="label">Tools</p>
					<p>{p.tools}</p>
					<p class="label">Data Source</p>
					<p class="label">Year</p>
					<p>{p.year}</p>
					<p class="label">Tags</p>
					<div class="tags">
						{#each p.tags as tag}
							<p>{tag}</p>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex: 0.1;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;
		padding: 5em;
	}

	.card {
		background: white;
		border-radius: 10px;
		padding: 1em;
		margin: 1em 0;
		display: grid;
		grid-template-columns: 3fr 2fr;
	}

	.card h2 {
		text-transform: lowercase;
		font-size: 2em;
		margin-top: 0;
	}

	.description {
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
		section {
			padding: 2em;
		}
	}
</style>
